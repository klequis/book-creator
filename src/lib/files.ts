"use server"

import { query, action } from "@solidjs/router"
import { readdir, readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises"
import { join, resolve } from "path"

// Base path for the example book
const BOOK_BASE_PATH = resolve(process.cwd(), "book-ex/manuscript-2-3-4")

export type FileEntry = {
  name: string
  isDirectory: boolean
  path: string
}

type QueryResponse<T> = {
  success: boolean
  data: T[]
  error: any
}

type FileContentResponse = {
  success: boolean
  data: string
  error: any
}

type ActionResponse = {
  success: boolean
  data: any
  errors: any
}

// Query to read directory contents
export const getDirectoryContents = query(
  async (dirPath: string = "."): Promise<QueryResponse<FileEntry>> => {
    "use server"
    
    try {
      const fullPath = dirPath === "." ? BOOK_BASE_PATH : join(BOOK_BASE_PATH, dirPath)
      const entries = await readdir(fullPath, { withFileTypes: true })
      const fileEntries = entries.map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: dirPath === "." ? entry.name : join(dirPath, entry.name)
      }))
      
      return {
        success: true,
        data: fileEntries,
        error: null
      }
    } catch (e) {
      console.error("Failed to read directory:", e)
      return {
        success: false,
        data: [],
        error: e instanceof Error ? e.message : "Failed to read directory"
      }
    }
  },
  "getDirectoryContents"
)

// Query to read file contents
export const getFileContents = query(
  async (filePath: string): Promise<FileContentResponse> => {
    "use server"
    
    try {
      const fullPath = join(BOOK_BASE_PATH, filePath)
      const content = await fsReadFile(fullPath, "utf-8")
      
      return {
        success: true,
        data: content,
        error: null
      }
    } catch (e) {
      console.error("Failed to read file:", e)
      return {
        success: false,
        data: "",
        error: e instanceof Error ? e.message : "Failed to read file"
      }
    }
  },
  "getFileContents"
)

// Action to save file contents
export const saveFileContents = action(
  async (formData: FormData): Promise<ActionResponse> => {
    "use server"
    
    try {
      const filePath = formData.get("filePath") as string
      const content = formData.get("content") as string
      
      if (!filePath) {
        return {
          success: false,
          data: null,
          errors: "File path is required"
        }
      }
      
      const fullPath = join(BOOK_BASE_PATH, filePath)
      await fsWriteFile(fullPath, content, "utf-8")
      
      return {
        success: true,
        data: null,
        errors: null
      }
    } catch (e) {
      console.error("Failed to write file:", e)
      return {
        success: false,
        data: null,
        errors: e instanceof Error ? e.message : "Failed to write file"
      }
    }
  },
  "saveFileContents"
)
