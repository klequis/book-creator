/**
 * Reactive book structure store using Solid's createStore
 */

import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import type { Book, Section } from '../types/book';
import { bookService } from '../services/bookService';
import { showError, showSuccess } from '../utils/notifications';

export interface RecentBook {
  path: string;
  lastOpened: number;
}

interface BookState extends Book {
  loading: boolean;
  error: string | null;
  recentBooks: RecentBook[];
}

const initialState: BookState = {
  rootPath: '',
  resourcesPath: null,
  bookParts: [],
  chapters: [],
  sections: [],
  loading: false,
  error: null,
  recentBooks: []
};

const [bookStore, setBookStore] = createStore<BookState>(initialState);

const MAX_RECENT_BOOKS = 5;
const STORE_KEY = 'recentBooks';

let storeInstance: Awaited<ReturnType<typeof load>> | null = null;

async function getStore() {
  if (!storeInstance) {
    storeInstance = await load('settings.json');
  }
  return storeInstance;
}

async function loadRecentBooksFromStore(): Promise<RecentBook[]> {
  const store = await getStore();
  const books = await store.get<RecentBook[]>(STORE_KEY);
  return books || [];
}

async function saveRecentBooksToStore(books: RecentBook[]): Promise<void> {
  const store = await getStore();
  await store.set(STORE_KEY, books);
  await store.save();
}

// Initialize recent books on first import
loadRecentBooksFromStore().then(books => {
  setBookStore('recentBooks', books);
});

// Helper functions for store mutations
export const bookStoreActions = {
  async loadBook(rootPath: string) {
    setBookStore('loading', true);
    setBookStore('error', null);
    
    try {
      console.log('[BookStore] Loading book from:', rootPath);
      const structure = await bookService.scanWorkspace(rootPath);
      
      setBookStore({
        rootPath: structure.rootPath,
        resourcesPath: structure.resourcesPath,
        bookParts: structure.bookParts,
        chapters: structure.chapters,
        sections: structure.sections,
        loading: false,
        error: null
      });
      
      console.log('[BookStore] Book loaded. Sections:', structure.sections.length);
      
      // Add to recent books
      await this.addToRecentBooks(rootPath);
    } catch (error) {
      console.error('[BookStore] Error loading book:', error);
      setBookStore('loading', false);
      setBookStore('error', error instanceof Error ? error.message : String(error));
    }
  },

  async addToRecentBooks(path: string) {
    const books = bookStore.recentBooks;
    
    // Remove existing entry if present
    const filtered = books.filter(book => book.path !== path);
    
    // Add new entry at the front
    const updated: RecentBook[] = [
      { path, lastOpened: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_BOOKS);
    
    setBookStore('recentBooks', updated);
    await saveRecentBooksToStore(updated);
  },

  async removeFromRecentBooks(path: string) {
    const filtered = bookStore.recentBooks.filter(book => book.path !== path);
    setBookStore('recentBooks', filtered);
    await saveRecentBooksToStore(filtered);
  },

  async clearRecentBooks() {
    setBookStore('recentBooks', []);
    await saveRecentBooksToStore([]);
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
  },

  /**
   * Close the current book
   */
  closeBook() {
    console.log('[BookStore] Closing book');
    setBookStore(initialState);
  },

  /**
   * Optimistically rename a section with rollback on failure
   */
  async renameSection(sectionId: string, newTitle: string) {
    const section = bookStore.sections.find(s => s.id === sectionId);
    if (!section) {
      showError('Section not found');
      return false;
    }

    // Store old values for rollback
    const oldSection = { ...section };

    // Build new filename and path
    const newFileName = section.fileName.replace(/\s+(.+)\.md$/, ` ${newTitle}.md`);
    const newPath = section.filePath.replace(section.fileName, newFileName);
    
    // Build new display label
    const newDisplayLabel = buildDisplayLabel(
      section.chapterNum,
      section.section2Num,
      section.section3Num,
      section.section4Num,
      section.level,
      newTitle
    );

    try {
      // 1. Optimistically update UI
      this.updateSection(sectionId, {
        title: newTitle,
        fileName: newFileName,
        filePath: newPath,
        displayLabel: newDisplayLabel
      });

      // 2. Update filesystem
      await invoke('rename_path', {
        oldPath: oldSection.filePath,
        newPath: newPath
      });

      // 3. Update file content (the heading)
      const oldContent = await invoke<string>('read_file', { path: newPath });
      const newContent = oldContent.replace(
        new RegExp(`^(#{1,4})\\s+.*$`, 'm'),
        `$1 ${buildHeading(section, newTitle)}`
      );
      await invoke('write_file', {
        path: newPath,
        contents: newContent
      });

      showSuccess('Section renamed successfully');
      return true;
    } catch (error) {
      // 4. Rollback on failure
      console.error('[BookStore] Failed to rename section:', error);
      this.updateSection(sectionId, oldSection);
      showError(`Failed to rename section: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Optimistically promote a section to a higher level (decrease level number)
   * Level 2 -> Level 1, or Level 3 -> Level 2
   */
  async promoteSection(sectionId: string) {
    const section = bookStore.sections.find(s => s.id === sectionId);
    if (!section) {
      showError('Section not found');
      return false;
    }

    if (!canPromote(section)) {
      showError('Cannot promote this section (only levels 2-3 can be promoted)');
      return false;
    }

    // Store old values for rollback
    const oldSection = { ...section };
    const newLevel = section.level - 1;

    // Build new section numbers based on promotion
    let newSection2Num = section.section2Num;
    let newSection3Num = section.section3Num;
    let newSection4Num = section.section4Num;

    if (section.level === 2) {
      // Level 2 -> Level 1: keep section2Num, clear section3Num
      newSection3Num = '';
      newSection4Num = '';
    } else if (section.level === 3) {
      // Level 3 -> Level 2: keep section2Num and section3Num, clear section4Num
      newSection4Num = '';
    }

    // Build new filename
    let newFileName: string;
    if (newLevel === 1) {
      newFileName = `${section.chapterNum}.${newSection2Num} ${section.title}.md`;
    } else if (newLevel === 2) {
      newFileName = `${section.chapterNum}.${newSection2Num}.${newSection3Num} ${section.title}.md`;
    } else {
      newFileName = section.fileName;
    }

    const newPath = section.filePath.replace(section.fileName, newFileName);
    const newDisplayLabel = buildDisplayLabel(
      section.chapterNum,
      newSection2Num,
      newSection3Num,
      newSection4Num,
      newLevel,
      section.title
    );

    // Calculate new heading markdown (fewer # symbols)
    const headingPrefix = '#'.repeat(newLevel + 1); // level 0=#, level 1=##, etc.
    const newHeading = buildHeading({...section, level: newLevel, section2Num: newSection2Num, section3Num: newSection3Num, section4Num: newSection4Num}, section.title);

    try {
      // 1. Optimistically update UI
      this.updateSection(sectionId, {
        level: newLevel,
        section2Num: newSection2Num,
        section3Num: newSection3Num,
        section4Num: newSection4Num,
        fileName: newFileName,
        filePath: newPath,
        displayLabel: newDisplayLabel
      });

      // 2. Update filesystem
      await invoke('rename_path', {
        oldPath: oldSection.filePath,
        newPath: newPath
      });

      // 3. Update file content (the heading)
      const oldContent = await invoke<string>('read_file', { path: newPath });
      const newContent = oldContent.replace(
        new RegExp(`^(#{1,4})\\s+.*$`, 'm'),
        `${headingPrefix} ${newHeading}`
      );
      await invoke('write_file', {
        path: newPath,
        contents: newContent
      });

      showSuccess('Section promoted successfully');
      return true;
    } catch (error) {
      // 4. Rollback on failure
      console.error('[BookStore] Failed to promote section:', error);
      this.updateSection(sectionId, oldSection);
      showError(`Failed to promote section: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Optimistically demote a section to a lower level (increase level number)
   * Level 1 -> Level 2, or Level 2 -> Level 3
   */
  async demoteSection(sectionId: string) {
    const section = bookStore.sections.find(s => s.id === sectionId);
    if (!section) {
      showError('Section not found');
      return false;
    }

    if (!canDemote(section)) {
      showError('Cannot demote this section (only levels 1-2 can be demoted)');
      return false;
    }

    // Store old values for rollback
    const oldSection = { ...section };
    const newLevel = section.level + 1;

    // Build new section numbers based on demotion
    let newSection2Num = section.section2Num;
    let newSection3Num = section.section3Num;
    let newSection4Num = section.section4Num;

    if (section.level === 1) {
      // Level 1 -> Level 2: add section3Num
      newSection3Num = getNextSectionNumber(bookStore.sections, section.chapterNum, section.section2Num, '', 2);
    } else if (section.level === 2) {
      // Level 2 -> Level 3: add section4Num
      newSection4Num = getNextSectionNumber(bookStore.sections, section.chapterNum, section.section2Num, section.section3Num, 3);
    }

    // Build new filename
    let newFileName: string;
    if (newLevel === 2) {
      newFileName = `${section.chapterNum}.${newSection2Num}.${newSection3Num} ${section.title}.md`;
    } else if (newLevel === 3) {
      newFileName = `${section.chapterNum}.${newSection2Num}.${newSection3Num}.${newSection4Num} ${section.title}.md`;
    } else {
      newFileName = section.fileName;
    }

    const newPath = section.filePath.replace(section.fileName, newFileName);
    const newDisplayLabel = buildDisplayLabel(
      section.chapterNum,
      newSection2Num,
      newSection3Num,
      newSection4Num,
      newLevel,
      section.title
    );

    // Calculate new heading markdown (more # symbols)
    const headingPrefix = '#'.repeat(newLevel + 1); // level 0=#, level 1=##, etc.
    const newHeading = buildHeading({...section, level: newLevel, section2Num: newSection2Num, section3Num: newSection3Num, section4Num: newSection4Num}, section.title);

    try {
      // 1. Optimistically update UI
      this.updateSection(sectionId, {
        level: newLevel,
        section2Num: newSection2Num,
        section3Num: newSection3Num,
        section4Num: newSection4Num,
        fileName: newFileName,
        filePath: newPath,
        displayLabel: newDisplayLabel
      });

      // 2. Update filesystem
      await invoke('rename_path', {
        oldPath: oldSection.filePath,
        newPath: newPath
      });

      // 3. Update file content (the heading)
      const oldContent = await invoke<string>('read_file', { path: newPath });
      const newContent = oldContent.replace(
        new RegExp(`^(#{1,4})\\s+.*$`, 'm'),
        `${headingPrefix} ${newHeading}`
      );
      await invoke('write_file', {
        path: newPath,
        contents: newContent
      });

      showSuccess('Section demoted successfully');
      return true;
    } catch (error) {
      // 4. Rollback on failure
      console.error('[BookStore] Failed to demote section:', error);
      this.updateSection(sectionId, oldSection);
      showError(`Failed to demote section: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
};

// Validation helpers for promote/demote operations
function canPromote(section: Section): boolean {
  // Only levels 2 and 3 can be promoted
  return section.level >= 2 && section.level <= 3;
}

function canDemote(section: Section): boolean {
  // Only levels 1 and 2 can be demoted
  return section.level >= 1 && section.level <= 2;
}

// Helper to find next available section number when demoting
function getNextSectionNumber(sections: Section[], chapterNum: string, section2Num: string, section3Num: string, targetLevel: number): string {
  if (targetLevel === 2) {
    // Demoting to level 2: find max section3Num for this chapter.section2
    const sameLevelSections = sections.filter(s => 
      s.chapterNum === chapterNum && 
      s.section2Num === section2Num &&
      s.level === 2
    );
    if (sameLevelSections.length === 0) return '01';
    const maxNum = Math.max(...sameLevelSections.map(s => parseInt(s.section3Num)));
    return String(maxNum + 1).padStart(2, '0');
  } else if (targetLevel === 3) {
    // Demoting to level 3: find max section4Num for this chapter.section2.section3
    const sameLevelSections = sections.filter(s => 
      s.chapterNum === chapterNum && 
      s.section2Num === section2Num &&
      s.section3Num === section3Num &&
      s.level === 3
    );
    if (sameLevelSections.length === 0) return '01';
    const maxNum = Math.max(...sameLevelSections.map(s => parseInt(s.section4Num)));
    return String(maxNum + 1).padStart(2, '0');
  }
  return '01';
}

// Helper function to build display labels
function buildDisplayLabel(
  chapterNum: string,
  section2Num: string,
  section3Num: string,
  section4Num: string,
  level: number,
  titleText: string
): string {
  if (level === 0) {
    return `${parseInt(chapterNum)} Chapter Title Page`;
  } else if (level === 1) {
    return `${parseInt(chapterNum)}.${parseInt(section2Num)} ${titleText}`;
  } else if (level === 2) {
    return `${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)} ${titleText}`;
  } else {
    return `${parseInt(chapterNum)}.${parseInt(section2Num)}.${parseInt(section3Num)}.${parseInt(section4Num)} ${titleText}`;
  }
}

// Helper function to build markdown heading
function buildHeading(section: Section, title: string): string {
  if (section.level === 0) {
    return `# ${parseInt(section.chapterNum)} ${title}`;
  } else if (section.level === 1) {
    return `${parseInt(section.chapterNum)}.${parseInt(section.section2Num)} ${title}`;
  } else if (section.level === 2) {
    return `${parseInt(section.chapterNum)}.${parseInt(section.section2Num)}.${parseInt(section.section3Num)} ${title}`;
  } else {
    return `${parseInt(section.chapterNum)}.${parseInt(section.section2Num)}.${parseInt(section.section3Num)}.${parseInt(section.section4Num)} ${title}`;
  }
}

export { bookStore };
