/**
 * Book scanning and parsing service
 * Flat/normalized structure with ID-based relationships
 */

import { invoke } from '@tauri-apps/api/core';
import type { Book, Chapter, BookPart, Section } from '../types/book';

export class BookService {
  private cache: Book | null = null;

  async getStructure(rootPath: string): Promise<Book | null> {
    if (this.cache && this.cache.rootPath === rootPath) {
      return this.cache;
    }

    this.cache = await this.scanWorkspace(rootPath);
    return this.cache;
  }

  invalidateCache() {
    this.cache = null;
  }

  private async scanWorkspace(rootPath: string): Promise<Book> {
    const bookParts: BookPart[] = [];
    const chapters: Chapter[] = [];
    const sections: Section[] = [];
    let resourcesPath: string | null = null;

    try {
      // Read directory using Tauri command
      const entries: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
        path: rootPath
      });

      console.log('[BookService] Scanning workspace:', rootPath);
      console.log('[BookService] Found entries:', entries.map(e => `${e.name} (${e.is_dir ? 'dir' : 'file'})`));

      for (const entry of entries) {
        if (!entry.is_dir) continue;

        const { name } = entry;
        const folderPath = `${rootPath}/${name}`;

        console.log(`[BookService] Processing folder: ${name}`);

        // Check for resources folder
        if (name === 'resources') {
          console.log('[BookService] Found resources folder');
          resourcesPath = folderPath;
          continue;
        }

        // Check for Introduction
        if (name === 'Introduction') {
          console.log('[BookService] Found Introduction folder');
          const { chapter, chapterSections } = await this.scanChapter(folderPath, name, '00', null, true, false);
          chapters.push(chapter);
          sections.push(...chapterSections);
        }
        // Check for Parts
        else if (name.match(/^Part \d+/)) {
          console.log('[BookService] Found Part folder:', name);
          const { part, partChapters, partSections } = await this.scanPart(folderPath, name);
          if (part) {
            bookParts.push(part);
            chapters.push(...partChapters);
            sections.push(...partSections);
          }
        }
        // Check for Appendices
        else if (name === 'Appendices') {
          console.log('[BookService] Found Appendices folder');
          const { appendixChapters, appendixSections } = await this.scanAppendices(folderPath);
          chapters.push(...appendixChapters);
          sections.push(...appendixSections);
        }
        // Standalone chapters (no parts)
        else if (name.match(/^\d+\s+/)) {
          console.log('[BookService] Found standalone chapter:', name);
          const chapterMatch = name.match(/^(\d+)\s+(.+)/);
          if (chapterMatch) {
            console.log('[BookService] Scanning standalone chapter...');
            const { chapter, chapterSections } = await this.scanChapter(folderPath, name, chapterMatch[1], null, false, false);
            console.log('[BookService] Chapter scanned:', chapter);
            chapters.push(chapter);
            sections.push(...chapterSections);
            console.log('[BookService] Added standalone chapter. Total chapters:', chapters.length);
          }
        } else {
          console.log('[BookService] Skipping folder (no pattern match):', name);
        }
      }

      // Sort bookParts by number
      bookParts.sort((a, b) => {
        const aNum = parseInt(a.partNum || '0');
        const bNum = parseInt(b.partNum || '0');
        return aNum - bNum;
      });

      console.log('[BookService] Final structure:', {
        bookParts: bookParts.length,
        chapters: chapters.length,
        sections: sections.length,
        resourcesPath
      });

      return {
        rootPath,
        resourcesPath,
        bookParts,
        chapters,
        sections
      };
    } catch (error) {
      console.error('[BookService] Error scanning workspace:', error);
      throw new Error(`Failed to scan book structure: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async scanPart(folderPath: string, folderName: string): Promise<{
    part: BookPart | null;
    partChapters: Chapter[];
    partSections: Section[];
  }> {
    const partMatch = folderName.match(/^Part (\d+)\s+(.+)/);
    if (!partMatch) return { part: null, partChapters: [], partSections: [] };

    const [, partNum, title] = partMatch;
    const partId = `part-${partNum}`;
    const partChapters: Chapter[] = [];
    const partSections: Section[] = [];

    const entries: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (!entry.is_dir) continue;

      const chapterMatch = entry.name.match(/^(\d+)\s+(.+)/);
      if (chapterMatch) {
        const chapterPath = `${folderPath}/${entry.name}`;
        const { chapter, chapterSections } = await this.scanChapter(chapterPath, entry.name, chapterMatch[1], partId, false, false);
        partChapters.push(chapter);
        partSections.push(...chapterSections);
      }
    }

    // Sort chapters by number
    partChapters.sort((a, b) => parseInt(a.chapterNum) - parseInt(b.chapterNum));

    const part: BookPart = {
      id: partId,
      folderPath,
      folderName,
      partNum,
      title
    };

    return { part, partChapters, partSections };
  }

  private async scanAppendices(folderPath: string): Promise<{
    appendixChapters: Chapter[];
    appendixSections: Section[];
  }> {
    const appendixChapters: Chapter[] = [];
    const appendixSections: Section[] = [];
    
    const entries: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (!entry.is_dir) continue;

      const appendixMatch = entry.name.match(/^([A-Z])\s+(.+)/);
      if (appendixMatch) {
        const chapterPath = `${folderPath}/${entry.name}`;
        const { chapter, chapterSections } = await this.scanChapter(chapterPath, entry.name, appendixMatch[1], null, false, true);
        appendixChapters.push(chapter);
        appendixSections.push(...chapterSections);
      }
    }

    // Sort by letter
    appendixChapters.sort((a, b) => a.chapterNum.localeCompare(b.chapterNum));

    return { appendixChapters, appendixSections };
  }

  private async scanChapter(
    folderPath: string,
    folderName: string,
    chapterNum: string,
    bookPartId: string | null,
    isIntroduction: boolean,
    isAppendix: boolean
  ): Promise<{
    chapter: Chapter;
    chapterSections: Section[];
  }> {
    const titleMatch = folderName.match(/^(?:\d+|[A-Z])\s+(.+)/);
    const title = titleMatch ? titleMatch[1] : folderName;
    const chapterId = isIntroduction ? 'intro' : isAppendix ? `appendix-${chapterNum}` : `chapter-${chapterNum}`;

    const chapterSections: Section[] = [];
    const entries: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
      path: folderPath
    });

    for (const entry of entries) {
      if (entry.is_dir || !entry.name.endsWith('.md')) continue;

      const section = this.parseFileName(folderPath, entry.name, chapterNum, chapterId);
      if (section) {
        chapterSections.push(section);
      }
    }

    // Sort sections by their numbering
    chapterSections.sort((a, b) => {
      const aKey = `${a.section2Num}-${a.section3Num}-${a.section4Num}`;
      const bKey = `${b.section2Num}-${b.section3Num}-${b.section4Num}`;
      return aKey.localeCompare(bKey);
    });

    const chapter: Chapter = {
      id: chapterId,
      bookPartId,
      folderPath,
      folderName,
      chapterNum,
      title,
      isIntroduction,
      isAppendix
    };

    return { chapter, chapterSections };
  }

  private parseFileName(
    folderPath: string,
    fileName: string,
    expectedChapter: string,
    chapterId: string
  ): Section | null {
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

    const sectionId = `${chapterId}-${section2Num}-${section3Num}-${section4Num || '00'}`;

    return {
      id: sectionId,
      chapterId,
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
