// Book structure storage using unstorage with Tauri filesystem adapter
import { createStorage } from 'unstorage';
import { readTextFile, writeTextFile, exists, remove } from '@tauri-apps/plugin-fs';
import type { Book } from './types';

/**
 * Create a custom unstorage driver using Tauri filesystem
 */
function tauriDriver(basePath: string) {
  return {
    name: 'tauri-fs',
    options: { basePath },
    async hasItem(key: string) {
      try {
        return await exists(`${basePath}/${key}`);
      } catch {
        return false;
      }
    },
    async getItem(key: string) {
      try {
        const content = await readTextFile(`${basePath}/${key}`);
        return JSON.parse(content);
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: any) {
      const content = JSON.stringify(value, null, 2);
      await writeTextFile(`${basePath}/${key}`, content);
    },
    async removeItem(key: string) {
      try {
        await remove(`${basePath}/${key}`);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    },
    async getKeys() {
      // Not implemented for now
      return [];
    },
    async clear() {
      // Not implemented for now
    }
  };
}

/**
 * Create storage instance for book data
 * @param basePath - Base directory for book data (e.g., '/path/to/book-project')
 */
export function createBookStorage(basePath: string) {
  const storage = createStorage({
    driver: tauriDriver(basePath)
  });

  return {
    /**
     * Load book structure from disk
     */
    async loadBook(): Promise<Book | null> {
      try {
        const book = await storage.getItem<Book>('book-structure.json');
        return book;
      } catch (error) {
        console.error('Failed to load book structure:', error);
        return null;
      }
    },

    /**
     * Save book structure to disk
     */
    async saveBook(book: Book): Promise<boolean> {
      try {
        await storage.setItem('book-structure.json', book);
        return true;
      } catch (error) {
        console.error('Failed to save book structure:', error);
        return false;
      }
    },

    /**
     * Check if book structure exists
     */
    async hasBook(): Promise<boolean> {
      return await storage.hasItem('book-structure.json');
    },

    /**
     * Create new empty book structure
     */
    async createNewBook(initialData?: Partial<Book>): Promise<Book> {
      const newBook: Book = {
        chapters: initialData?.chapters || [],
        appendices: initialData?.appendices || [],
        ...initialData
      };
      
      await storage.setItem('book-structure.json', newBook);
      return newBook;
    },

    /**
     * Delete book structure
     */
    async deleteBook(): Promise<void> {
      await storage.removeItem('book-structure.json');
    }
  };
}

/**
 * Type for the storage instance
 */
export type BookStorage = ReturnType<typeof createBookStorage>;
