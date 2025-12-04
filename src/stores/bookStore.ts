import { createStore } from "solid-js/store"
import { query } from "@solidjs/router"
import type { Book } from "~/types"
import { createBookStorage } from "~/lib/storage"
import { resolve } from "path"

interface BookState {
  book: Book | null
  rootPath: string | null
  loading: boolean
  error: string | null
}

const initialState: BookState = {
  book: null,
  rootPath: null,
  loading: false,
  error: null
}

export const [bookStore, setBookStore] = createStore<BookState>(initialState)

const BOOK_BASE_PATH = resolve(process.cwd(), "book-ex/manuscript-2-3-4")

/**
 * Load book structure from JSON file
 */
export const loadBookStructure = query(async () => {
  "use server"
  
  try {
    const storage = createBookStorage(BOOK_BASE_PATH)
    const book = await storage.loadBook()
    
    if (!book) {
      return {
        success: false,
        error: "No book-structure.json found"
      }
    }
    
    return {
      success: true,
      book,
      rootPath: BOOK_BASE_PATH
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}, "loadBookStructure")
