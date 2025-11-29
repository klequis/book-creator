/**
 * Book scanning and parsing service
 * Ported from VS Code extension bookMetadataService.ts
 */

import { invoke } from '@tauri-apps/api/core';
import type { BookStructure, ChapterMetadata, PartMetadata, FileMetadata } from '../types/book';

export class BookService {
  private cache: BookStructure | null = null;

  async getStructure(rootPath: string): Promise<BookStructure | null> {
    if (this.cache && this.cache.rootPath === rootPath) {
      return this.cache;
    }

    this.cache = await this.scanWorkspace(rootPath);
    return this.cache;
  }

  invalidateCache() {
    this.cache = null;
  }

  private async scanWorkspace(rootPath: string): Promise<BookStructure> {
    const structure: BookStructure = {
      parts: [],
      appendices: [],
      rootPath
    };

    // Read directory using Tauri command
    const entries: Array<{ name: string; isDir: boolean }> = await invoke('read_directory', {
      path: rootPath
    });

    console.log('[BookService] Scanning workspace:', rootPath);
    console.log('[BookService] Found entries:', entries.map(e => e.name));

    for (const entry of entries) {
      if (!entry.isDir) continue;

      const { name } = entry;
      const folderPath = `${rootPath}/${name}`;

      // Check for Introduction
      if (name === 'Introduction') {
        console.log('[BookService] Found Introduction folder');
        structure.introduction = await this.scanChapter(folderPath, name, '00');
        console.log('[BookService] Introduction scanned:', structure.introduction);
      }
      // Check for Parts
      else if (name.match(/^Part \d+/)) {
        const part = await this.scanPart(folderPath, name);
        if (part) {
          structure.parts.push(part);
        }
      }
      // Check for Appendices
      else if (name === 'Appendices') {
        const appendixChapters = await this.scanAppendices(folderPath);
        structure.appendices.push(...appendixChapters);
      }
      // Standalone chapters (no parts)
      else if (name.match(/^\d+\s+/)) {
        const chapterMatch = name.match(/^(\d+)\s+(.+)/);
        if (chapterMatch) {
          const chapter = await this.scanChapter(folderPath, name, chapterMatch[1]);
          // Add as a virtual "part" with single chapter
          structure.parts.push({
            folderPath: rootPath,
            folderName: '',
            partNum: '',
            title: '',
            chapters: [chapter]
          });
        }
      }
    }

    // Sort parts by number
    structure.parts.sort((a, b) => {
      const aNum = parseInt(a.partNum || '0');
      const bNum = parseInt(b.partNum || '0');
      return aNum - bNum;
    });

    return structure;
  }

  private async scanPart(folderPath: string, folderName: string): Promise<PartMetadata | null> {
    const partMatch = folderName.match(/^Part (\d+)\s+(.+)/);
    if (!partMatch) return null;

    const [, partNum, title] = partMatch;
    const chapters: ChapterMetadata[] = [];

    const entries: Array<{ name: string; isDir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (!entry.isDir) continue;

      const chapterMatch = entry.name.match(/^(\d+)\s+(.+)/);
      if (chapterMatch) {
        const chapterPath = `${folderPath}/${entry.name}`;
        const chapter = await this.scanChapter(chapterPath, entry.name, chapterMatch[1]);
        chapters.push(chapter);
      }
    }

    // Sort chapters by number
    chapters.sort((a, b) => parseInt(a.chapterNum) - parseInt(b.chapterNum));

    return {
      folderPath,
      folderName,
      partNum,
      title,
      chapters
    };
  }

  private async scanAppendices(folderPath: string): Promise<ChapterMetadata[]> {
    const appendices: ChapterMetadata[] = [];
    const entries: Array<{ name: string; isDir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (!entry.isDir) continue;

      const appendixMatch = entry.name.match(/^([A-Z])\s+(.+)/);
      if (appendixMatch) {
        const chapterPath = `${folderPath}/${entry.name}`;
        const chapter = await this.scanChapter(chapterPath, entry.name, appendixMatch[1]);
        appendices.push(chapter);
      }
    }

    // Sort by letter
    appendices.sort((a, b) => a.chapterNum.localeCompare(b.chapterNum));

    return appendices;
  }

  private async scanChapter(
    folderPath: string,
    folderName: string,
    chapterNum: string
  ): Promise<ChapterMetadata> {
    const titleMatch = folderName.match(/^(?:\d+|[A-Z])\s+(.+)/);
    const title = titleMatch ? titleMatch[1] : folderName;

    const files: FileMetadata[] = [];
    const entries: Array<{ name: string; isDir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (entry.isDir || !entry.name.endsWith('.md')) continue;

      const fileMetadata = this.parseFileName(folderPath, entry.name, chapterNum);
      if (fileMetadata) {
        files.push(fileMetadata);
      }
    }

    // Sort files by their numbering
    files.sort((a, b) => {
      const aKey = `${a.section2Num}-${a.section3Num}-${a.section4Num}`;
      const bKey = `${b.section2Num}-${b.section3Num}-${b.section4Num}`;
      return aKey.localeCompare(bKey);
    });

    return {
      folderPath,
      folderName,
      chapterNum,
      title,
      files
    };
  }

  private parseFileName(
    folderPath: string,
    fileName: string,
    expectedChapter: string
  ): FileMetadata | null {
    // Pattern: NN-SS-TT-UU Title.md or NN-SS-TT Title.md
    const match = fileName.match(/^(\d+|[A-Z])-(\d+)-(\d+)(?:-(\d+))?\s+(.+)\.md$/);
    if (!match) return null;

    const [, chapterNum, section2Num, section3Num, section4Num, titleText] = match;

    // Validate chapter number matches folder
    if (chapterNum !== expectedChapter) return null;

    // Determine level (0=chapter, 1=H2, 2=H3, 3=H4)
    let level = 0;
    if (section2Num === '00' && section3Num === '00') {
      level = 0; // Main chapter file
    } else if (section3Num === '00') {
      level = 1; // H2 section
    } else if (section4Num === '00' || !section4Num) {
      level = 2; // H3 section
    } else {
      level = 3; // H4 section
    }

    // Build display label with indentation
    const indent = '  '.repeat(level); // 2 spaces per level
    let displayLabel = '';
    if (level === 0) {
      displayLabel = `${parseInt(chapterNum)}. ${titleText}`;
    } else if (level === 1) {
      displayLabel = `${indent}${parseInt(chapterNum)}.${parseInt(section2Num)}. ${titleText}`;
    } else if (level === 2) {
      displayLabel = `${indent}${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)}. ${titleText}`;
    } else {
      displayLabel = `${indent}${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)}.${parseInt(section4Num || '0')}. ${titleText}`;
    }

    return {
      filePath: `${folderPath}/${fileName}`,
      fileName,
      title: titleText,
      chapterNum,
      section2Num,
      section3Num,
      section4Num: section4Num || '00',
      displayLabel,
      level
    };
  }
}

export const bookService = new BookService();
