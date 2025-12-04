"use server"

import { readdir, readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises"
import { join } from "path"

export type FileEntry = {
  name: string
  isDirectory: boolean
  path: string
}

export async function readDir(dirPath: string): Promise<FileEntry[]> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    path: join(dirPath, entry.name)
  }))
}

export async function readFile(filePath: string): Promise<string> {
  return await fsReadFile(filePath, "utf-8")
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fsWriteFile(filePath, content, "utf-8")
}
