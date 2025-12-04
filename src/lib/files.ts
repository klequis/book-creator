"use server"

import { readdir, readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises"
import { join, resolve } from "path"

// Base path for the example book
const BOOK_BASE_PATH = resolve(process.cwd(), "book-ex/manuscript-2-3-4")

export type FileEntry = {
  name: string
  isDirectory: boolean
  path: string
}

export async function readDir(dirPath: string): Promise<FileEntry[]> {
  const fullPath = dirPath === "." ? BOOK_BASE_PATH : join(BOOK_BASE_PATH, dirPath)
  const entries = await readdir(fullPath, { withFileTypes: true })
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    path: dirPath === "." ? entry.name : join(dirPath, entry.name)
  }))
}

export async function readFile(filePath: string): Promise<string> {
  const fullPath = join(BOOK_BASE_PATH, filePath)
  return await fsReadFile(fullPath, "utf-8")
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const fullPath = join(BOOK_BASE_PATH, filePath)
  await fsWriteFile(fullPath, content, "utf-8")
}
