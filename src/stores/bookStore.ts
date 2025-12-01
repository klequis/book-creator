/**
 * Reactive book structure store using Solid's createStore
 */

import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';
import type { Book, Section } from '../types/book';
import { bookService } from '../services/bookService';
import { showError, showSuccess } from '../utils/notifications';
import { addRecentBook } from '../utils/recentBooks';

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
      
      // Add to recent books
      await addRecentBook(rootPath);
      
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
  }
};

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
