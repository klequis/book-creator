/**
 * Script to generate book-structure.json from markdown files
 * Run with: tsx scripts/generate-book-structure.ts
 */

import { writeFile } from "fs/promises"
import { join, resolve } from "path"
import { parseBookStructure } from "../src/lib/book-parser"

const BOOK_PATH = resolve(process.cwd(), "book-ex/manuscript-2-3-4")
const OUTPUT_PATH = join(BOOK_PATH, "book-structure.json")

async function main() {
  console.log("Parsing book structure from:", BOOK_PATH)
  
  try {
    const book = await parseBookStructure(BOOK_PATH)
    
    console.log("\nBook structure parsed:")
    console.log("- Introduction:", book.introduction ? "YES" : "NO")
    console.log("- Parts:", book.parts?.length || 0)
    console.log("- Chapters:", book.chapters.length)
    console.log("- Appendices:", book.appendices.length)
    
    if (book.introduction) {
      console.log(`  Introduction sections: ${book.introduction.sections.length}`)
    }
    
    book.chapters.forEach((chapter, i) => {
      console.log(`  Chapter ${i + 1} sections: ${chapter.sections.length}`)
    })
    
    book.appendices.forEach((appendix, i) => {
      console.log(`  Appendix ${i + 1} sections: ${appendix.sections.length}`)
    })
    
    const json = JSON.stringify(book, null, 2)
    await writeFile(OUTPUT_PATH, json, 'utf-8')
    
    console.log("\n✅ Successfully wrote:", OUTPUT_PATH)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

main()
