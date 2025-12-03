/**
 * Reactive book structure store using Solid's createStore
 * Uses new type system with JSON-first architecture
 */

import { createStore } from 'solid-js/store';
import { load } from '@tauri-apps/plugin-store';
import type { Book } from '../types';
import { createBookStorage } from '../storage';
import { showError, showSuccess } from '../utils/notifications';
import { applyFileSystemChanges } from '../file-operations';

export interface RecentBook {
  path: string;
  lastOpened: number;
}

interface BookState {
  book: Book | null;
  rootPath: string | null;
  loading: boolean;
  error: string | null;
  dirty: boolean;
  recentBooks: RecentBook[];
}

const initialState: BookState = {
  book: null,
  rootPath: null,
  loading: false,
  error: null,
  dirty: false,
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

export const bookStoreActions = {
  /**
   * Load book from JSON file in specified directory
   */
  async loadBook(rootPath: string) {
    setBookStore('loading', true);
    setBookStore('error', null);
    
    try {
      console.log('[BookStore] Loading book from:', rootPath);
      
      const storage = createBookStorage(rootPath);
      const book = await storage.loadBook();
      
      if (!book) {
        throw new Error('No book-structure.json found in directory');
      }
      
      setBookStore({
        book,
        rootPath,
        loading: false,
        error: null,
        dirty: false
      });
      
      console.log('[BookStore] Book loaded successfully');
      
      // Add to recent books
      await this.addToRecentBooks(rootPath);
    } catch (error) {
      console.error('[BookStore] Error loading book:', error);
      setBookStore('loading', false);
      setBookStore('error', error instanceof Error ? error.message : String(error));
      showError(`Failed to load book: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  /**
   * Save current book to JSON file
   */
  async saveBook() {
    if (!bookStore.rootPath || !bookStore.book) {
      showError('No book loaded');
      return false;
    }

    try {
      const storage = createBookStorage(bookStore.rootPath);
      await storage.saveBook(bookStore.book);
      setBookStore('dirty', false);
      showSuccess('Book saved successfully');
      return true;
    } catch (error) {
      console.error('[BookStore] Error saving book:', error);
      showError(`Failed to save book: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Mark book as having unsaved changes
   */
  markDirty() {
    setBookStore('dirty', true);
  },

  /**
   * Apply section updates from movement operations
   * Automatically updates file system and saves book structure
   */
  async applySectionUpdates(updates: Array<{ id: string; level: 1 | 2 | 3 | 4; order: number; parentId?: string; oldFilePath: string; newFilePath: string; }>) {
    if (!bookStore.book || !bookStore.rootPath) return;

    try {
      // Collect all sections for heading prefix calculation
      const allSections: Array<{id: string, order: number, parentId?: string}> = [];
      const collectSections = (sections: any[]) => {
        sections.forEach(s => {
          allSections.push({ id: s.id, order: s.order, parentId: s.parentId });
        });
      };

      if (bookStore.book.introduction) {
        collectSections(bookStore.book.introduction.sections);
      }
      if (bookStore.book.parts) {
        bookStore.book.parts.forEach(part => {
          collectSections(part.sections);
          part.chapters.forEach(chapter => {
            collectSections(chapter.sections);
          });
        });
      }
      bookStore.book.chapters.forEach(chapter => {
        collectSections(chapter.sections);
      });
      bookStore.book.appendices.forEach(appendix => {
        collectSections(appendix.sections);
      });

      // Apply file system changes (rename files, update headings)
      const updatesWithFullPaths = updates.map(u => ({
        ...u,
        oldFilePath: `${bookStore.rootPath}/${u.oldFilePath}`,
        newFilePath: `${bookStore.rootPath}/${u.newFilePath}`
      }));
      
      await applyFileSystemChanges(updatesWithFullPaths, allSections);

      // Update all sections in the book structure
      const applyToSections = (sections: any[]) => {
        sections.forEach(section => {
          const update = updates.find(u => u.id === section.id);
          if (update) {
            section.level = update.level;
            section.order = update.order;
            section.parentId = update.parentId;
            section.filePath = update.newFilePath;
          }
        });
      };

      // Apply to all section arrays
      if (bookStore.book.introduction) {
        applyToSections(bookStore.book.introduction.sections);
      }
      if (bookStore.book.parts) {
        bookStore.book.parts.forEach(part => {
          applyToSections(part.sections);
          part.chapters.forEach(chapter => {
            applyToSections(chapter.sections);
          });
        });
      }
      bookStore.book.chapters.forEach(chapter => {
        applyToSections(chapter.sections);
      });
      bookStore.book.appendices.forEach(appendix => {
        applyToSections(appendix.sections);
      });

      // Auto-save the book structure
      await this.saveBook();
      
    } catch (error) {
      console.error('[BookStore] Error applying section updates:', error);
      showError(`Failed to apply changes: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
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

  /**
   * Close the current book
   */
  closeBook() {
    console.log('[BookStore] Closing book');
    setBookStore(initialState);
  }
};

export { bookStore };
