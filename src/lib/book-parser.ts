"use server"

import { readdir, readFile } from "fs/promises"
import { join } from "path"
import type { Book, Chapter, Section, Introduction, Part, Appendix } from "~/types"

/**
 * Generate a random 8-byte hex ID (xxxx-xxxx-xxxx-xxxx)
 */
function generateId(): string {
  const hex = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0')
  return `${hex()}-${hex()}-${hex()}-${hex()}`
}

/**
 * Extract the first heading from markdown content
 * Returns { level, text } or null
 */
function extractFirstHeading(content: string): { level: 1 | 2 | 3 | 4, text: string } | null {
  const lines = content.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length as 1 | 2 | 3 | 4
      const text = match[2].trim()
      return { level, text }
    }
  }
  
  return null
}

/**
 * Parse a filename prefix like "02-01-00" or "03.02"
 * Returns array of numbers: [2, 1, 0] or [3, 2]
 */
function parsePrefix(filename: string): number[] {
  const match = filename.match(/^(\d+[-.])+/)
  if (!match) return []
  
  return match[0]
    .replace(/[-.]$/, '') // Remove trailing separator
    .split(/[-.]/)
    .map(n => parseInt(n, 10))
}

/**
 * Determine section level from filename prefix
 * 02-00-00 = S1 (chapter title)
 * 02-01-00 = S2
 * 02-01-01 = S3
 * 02-01-01-00 = S4
 */
function getSectionLevel(prefix: number[]): 1 | 2 | 3 | 4 {
  // Remove trailing zeros to get effective depth
  while (prefix.length > 0 && prefix[prefix.length - 1] === 0) {
    prefix.pop()
  }
  
  const depth = prefix.length
  return Math.max(1, Math.min(4, depth)) as 1 | 2 | 3 | 4
}

/**
 * Parse all markdown files in a directory and create sections
 */
async function parseSections(dirPath: string, relativePath: string): Promise<Section[]> {
  const files = await readdir(dirPath)
  const sections: Section[] = []
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue
    
    const filePath = join(dirPath, file)
    const content = await readFile(filePath, 'utf-8')
    const heading = extractFirstHeading(content)
    
    if (!heading) {
      console.warn(`No heading found in ${file}, skipping`)
      continue
    }
    
    const prefix = parsePrefix(file)
    const level = getSectionLevel(prefix)
    
    // Verify heading level matches section level
    if (heading.level !== level) {
      console.warn(`Heading level mismatch in ${file}: heading is ${heading.level}, expected ${level}`)
    }
    
    sections.push({
      id: generateId(),
      level,
      filePath: join(relativePath, file).replace(/\\/g, '/'), // Normalize path separators
      order: prefix[prefix.length - 1] || 0,
      parentId: undefined // Will be set later when building hierarchy
    })
  }
  
  // Sort by order
  sections.sort((a, b) => a.order - b.order)
  
  return sections
}

/**
 * Parse the book structure from a directory
 */
export async function parseBookStructure(basePath: string): Promise<Book> {
  const book: Book = {
    chapters: [],
    appendices: []
  }
  
  const entries = await readdir(basePath, { withFileTypes: true })
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    
    const dirName = entry.name
    const dirPath = join(basePath, dirName)
    
    // Check for Introduction
    if (dirName.toLowerCase() === 'introduction') {
      const sections = await parseSections(dirPath, 'Introduction')
      if (sections.length > 0) {
        book.introduction = {
          id: generateId(),
          sections
        }
      }
      continue
    }
    
    // Check for Part (starts with P or Part)
    if (dirName.match(/^(P|Part)\s+\d+/i)) {
      // TODO: Implement Part parsing when needed
      console.log('Part detected but not yet implemented:', dirName)
      continue
    }
    
    // Check for Appendix (starts with A or Appendix)
    if (dirName.match(/^(A|Appendix)\s+/i)) {
      const sections = await parseSections(dirPath, dirName)
      if (sections.length > 0) {
        book.appendices.push({
          id: generateId(),
          sections
        })
      }
      continue
    }
    
    // Check for Chapter (starts with digit)
    if (dirName.match(/^\d+/)) {
      const sections = await parseSections(dirPath, dirName)
      if (sections.length > 0) {
        book.chapters.push({
          id: generateId(),
          sections
        })
      }
      continue
    }
  }
  
  return book
}
