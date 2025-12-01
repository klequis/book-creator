/**
 * Reactive book structure store using Solid's createStore
 */

import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';
import type { Book, Chapter, BookPart, Section } from '../types/book';

interface BookState extends Book {
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  rootPath: '',
  resourcesPath: null,
  bookParts: [],
  chapters: [],
  sections: [],
  loading: false,
  error: null
};

const [bookStore, setBookStore] = createStore<BookState>(initialState);

// Helper functions for store mutations
export const bookStoreActions = {
  async loadBook(rootPath: string) {
    setBookStore('loading', true);
    setBookStore('error', null);
    
    try {
      console.log('[BookStore] Loading book from:', rootPath);
      const structure = await scanWorkspace(rootPath);
      
      setBookStore({
        rootPath,
        resourcesPath: structure.resourcesPath,
        bookParts: structure.bookParts,
        chapters: structure.chapters,
        sections: structure.sections,
        loading: false,
        error: null
      });
      
      console.log('[BookStore] Book loaded. Sections:', structure.sections.length);
    } catch (error) {
      console.error('[BookStore] Error loading book:', error);
      setBookStore('loading', false);
      setBookStore('error', error instanceof Error ? error.message : String(error));
    }
  },

  addSection(section: Section) {
    console.log('[BookStore] Adding section:', section.fileName);
    setBookStore('sections', sections => [...sections, section]);
  },

  removeSection(sectionId: string) {
    console.log('[BookStore] Removing section:', sectionId);
    setBookStore('sections', sections => sections.filter(s => s.id !== sectionId));
  },

  updateSection(sectionId: string, updates: Partial<Section>) {
    console.log('[BookStore] Updating section:', sectionId);
    const index = bookStore.sections.findIndex(s => s.id === sectionId);
    if (index !== -1) {
      setBookStore('sections', index, updates);
    }
  },

  renameSectionFile(oldPath: string, newPath: string, newFileName: string) {
    console.log('[BookStore] Renaming section:', { oldPath, newPath });
    const index = bookStore.sections.findIndex(s => s.filePath === oldPath);
    if (index !== -1) {
      setBookStore('sections', index, {
        filePath: newPath,
        fileName: newFileName
      });
    }
  },
  /**
   * Refresh the book structure by reloading from the current root path
   */
  async refreshBook() {
    if (bookStore.rootPath) {
      await this.loadBook(bookStore.rootPath);
    }
  }
};

// Book scanning logic (same as bookService)
async function scanWorkspace(rootPath: string): Promise<Omit<Book, 'rootPath'>> {
  const bookParts: BookPart[] = [];
  const chapters: Chapter[] = [];
  const sections: Section[] = [];
  let resourcesPath: string | null = null;

  try {
    const entries: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
      path: rootPath
    });

    console.log('[BookStore] Scanning workspace:', rootPath);

    for (const entry of entries) {
      if (!entry.is_dir) continue;

      const { name } = entry;
      const folderPath = `${rootPath}/${name}`;

      // Check for resources folder
      if (name === 'resources') {
        console.log('[BookStore] Found resources folder');
        resourcesPath = folderPath;
        continue;
      }

      // Check for Introduction
      if (name === 'Introduction') {
        console.log('[BookStore] Found Introduction folder');
        const { chapter, chapterSections } = await scanChapter(folderPath, name, '00', null, true, false);
        chapters.push(chapter);
        sections.push(...chapterSections);
      }
      // Check for Parts
      else if (name.match(/^Part \d+/)) {
        console.log('[BookStore] Found Part folder:', name);
        const { part, partChapters, partSections } = await scanPart(folderPath, name);
        if (part) {
          bookParts.push(part);
          chapters.push(...partChapters);
          sections.push(...partSections);
        }
      }
      // Check for Appendices
      else if (name === 'Appendices') {
        console.log('[BookStore] Found Appendices folder');
        const { appendixChapters, appendixSections } = await scanAppendices(folderPath);
        chapters.push(...appendixChapters);
        sections.push(...appendixSections);
      }
      // Standalone chapters
      else if (name.match(/^\d+\s+/)) {
        console.log('[BookStore] Found standalone chapter:', name);
        const chapterMatch = name.match(/^(\d+)\s+(.+)/);
        if (chapterMatch) {
          const { chapter, chapterSections } = await scanChapter(folderPath, name, chapterMatch[1], null, false, false);
          chapters.push(chapter);
          sections.push(...chapterSections);
        }
      }
    }

    // Sort bookParts by number
    bookParts.sort((a, b) => {
      const aNum = parseInt(a.partNum || '0');
      const bNum = parseInt(b.partNum || '0');
      return aNum - bNum;
    });

    console.log('[BookStore] Final structure:', {
      bookParts: bookParts.length,
      chapters: chapters.length,
      sections: sections.length,
      resourcesPath
    });

    return {
      resourcesPath,
      bookParts,
      chapters,
      sections
    };
  } catch (error) {
    console.error('[BookStore] Error scanning workspace:', error);
    throw new Error(`Failed to scan book structure: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function scanPart(folderPath: string, folderName: string): Promise<{
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
      const { chapter, chapterSections } = await scanChapter(chapterPath, entry.name, chapterMatch[1], partId, false, false);
      partChapters.push(chapter);
      partSections.push(...chapterSections);
    }
  }

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

async function scanAppendices(folderPath: string): Promise<{
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
      const { chapter, chapterSections } = await scanChapter(chapterPath, entry.name, appendixMatch[1], null, false, true);
      appendixChapters.push(chapter);
      appendixSections.push(...chapterSections);
    }
  }

  appendixChapters.sort((a, b) => a.chapterNum.localeCompare(b.chapterNum));

  return { appendixChapters, appendixSections };
}

async function scanChapter(
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

    const section = parseFileName(folderPath, entry.name, chapterNum, chapterId);
    if (section) {
      chapterSections.push(section);
    }
  }

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

function parseFileName(
  folderPath: string,
  fileName: string,
  expectedChapter: string,
  chapterId: string
): Section | null {
  const match = fileName.match(/^(\d+|[A-Z])-(\d+)-(\d+)(?:-(\d+))?\s+(.+)\.md$/);
  if (!match) return null;

  const [, chapterNum, section2Num, section3Num, section4Num, titleText] = match;

  if (chapterNum !== expectedChapter) return null;

  let level = 0;
  if (section2Num === '00' && section3Num === '00') {
    level = 0;
  } else if (section3Num === '00') {
    level = 1;
  } else if (section4Num === '00' || !section4Num) {
    level = 2;
  } else {
    level = 3;
  }

  // Build display label
  let displayLabel = '';
  if (level === 0) {
    displayLabel = `${parseInt(chapterNum)}. Chapter Title Page`;
  } else if (level === 1) {
    displayLabel = `${parseInt(chapterNum)}.${parseInt(section2Num)}. ${titleText}`;
  } else if (level === 2) {
    displayLabel = `${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)}. ${titleText}`;
  } else {
    displayLabel = `${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)}.${parseInt(section4Num || '0')}. ${titleText}`;
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

export { bookStore };
