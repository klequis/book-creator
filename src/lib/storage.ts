"use server"

import { readFile, writeFile, access } from "fs/promises"
import { join } from "path"
import type { Book } from "~/types"

/**
 * Create storage instance for book data
 * @param basePath - Base directory for book data (e.g., '/path/to/book-project')
 */
export function createBookStorage(basePath: string) {
  const bookStructurePath = join(basePath, 'book-structure.json')

  return {
    /**
     * Load book structure from disk
     */
    async loadBook(): Promise<Book | null> {
      try {
        const content = await readFile(bookStructurePath, 'utf-8')
        const book = JSON.parse(content) as Book
        return book
      } catch (error) {
        console.error('Failed to load book structure:', error)
        return null
      }
    },

    /**
     * Save book structure to disk
     */
    async saveBook(book: Book): Promise<boolean> {
      try {
        const content = JSON.stringify(book, null, 2)
        await writeFile(bookStructurePath, content, 'utf-8')
        return true
      } catch (error) {
        console.error('Failed to save book structure:', error)
        return false
      }
    },

    /**
     * Check if book structure exists
     */
    async hasBook(): Promise<boolean> {
      try {
        await access(bookStructurePath)
        return true
      } catch {
        return false
      }
    },

    /**
     * Create new empty book structure
     */
    async createNewBook(initialData?: Partial<Book>): Promise<Book> {
      const newBook: Book = {
        chapters: initialData?.chapters || [],
        appendices: initialData?.appendices || [],
        ...initialData
      }
      
      const content = JSON.stringify(newBook, null, 2)
      await writeFile(bookStructurePath, content, 'utf-8')
      return newBook
    }
  }
}

/**
 * Type for the storage instance
 */
export type BookStorage = ReturnType<typeof createBookStorage>
