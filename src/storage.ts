// Book structure storage using unstorage
import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import type { Book } from './types';

/**
 * Create storage instance for book data
 * @param basePath - Base directory for book data (e.g., '/path/to/book-project')
 */
export function createBookStorage(basePath: string) {
  const storage = createStorage({
    driver: fsDriver({
      base: basePath
    })
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
