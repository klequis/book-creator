# Data Structures and Information Model

Complete list of all information the app uses about files, chapters, sections, and application state.

## Core Type Definitions

### Section (Section files - .md files)

Represents individual markdown section files within chapters.

- `id` - Unique identifier (format: `{chapterId}-{section2Num}-{section3Num}-{section4Num}`)
- `chapterId` - Parent chapter reference
- `filePath` - Full absolute path to the .md file
- `fileName` - Just the filename (e.g., "04-01-00 A Filename as a Route Segment.md")
- `title` - Section title text (extracted from filename)
- `chapterNum` - Chapter number (e.g., "04")
- `section2Num` - Level 1 section number (e.g., "01")
- `section3Num` - Level 2 section number (e.g., "00")
- `section4Num` - Level 3 section number (e.g., "00")
- `displayLabel` - Formatted label for tree view (e.g., "4.1 A Filename as a Route Segment")
- `level` - Hierarchy level (0=chapter title page, 1=section2, 2=section3, 3=section4)

### Chapter (Chapter folders)

Represents chapter directories containing section files.

- `id` - Unique identifier (format: `chapter-{chapterNum}`, or `intro` for introduction, or `appendix-{chapterNum}` for appendices)
- `bookPartId` - Parent book part reference (null if standalone)
- `folderPath` - Full absolute path to chapter folder
- `folderName` - Folder name (e.g., "04 Static Routes")
- `chapterNum` - Chapter number (e.g., "04")
- `title` - Chapter title (extracted from folder name)
- `isIntroduction` - Boolean flag for introduction chapters
- `isAppendix` - Boolean flag for appendix chapters

### BookPart (Part folders)

Represents book part directories that group multiple chapters.

- `id` - Unique identifier (format: `part-{partNum}`)
- `folderPath` - Full absolute path to part folder
- `folderName` - Folder name
- `partNum` - Part number
- `title` - Part title (extracted from folder name)

### Book (Root workspace)

Root structure containing all book components.

- `rootPath` - Root directory path of the book
- `resourcesPath` - Path to resources folder (nullable)
- `bookParts` - Array of all BookPart objects
- `chapters` - Array of all Chapter objects
- `sections` - Array of all Section objects

## Application State

### BookState (extends Book)

Active application state for the currently loaded book.

All Book properties plus:
- `loading` - Boolean loading state
- `error` - Error message (nullable)
- `recentBooks` - Array of recent book entries

### RecentBook

Tracks recently opened books for quick access.

- `path` - Root path to the book
- `lastOpened` - Timestamp (number) of when book was last opened

## Persisted Settings

Stored in `settings.json` via Tauri plugin-store.

### Location
- **Linux:** `~/.local/share/com.booktools.dev/settings.json`
- **macOS:** `~/Library/Application Support/com.booktools.dev/settings.json`
- **Windows:** `%APPDATA%\com.booktools.dev\settings.json`

### Stored Data

- `recentBooks` - Array of RecentBook objects (max 5)
- `lastBookPath` - String path to last opened book
- `zoom` - Editor zoom level (number)
- `previewZoom` - Preview zoom level (number)
- `windowState` - Window position and size object:
  - `x` - Window X position
  - `y` - Window Y position
  - `width` - Window width
  - `height` - Window height

## File Content

Data read from markdown files on disk.

- Markdown heading (first line starting with #)
- Full markdown content of sections
- File metadata (path, name, modification time via filesystem)

## Derived/Computed Information

Information calculated at runtime, not stored directly.

- Whether a section can be promoted (based on level 2-3)
- Whether a section can be demoted (based on level 1-2)
- Next available section number when adding/demoting sections
- Formatted display labels (built from numbers and titles)
- Markdown heading format (# count based on level)
- Display hierarchy and tree structure
- Section parent-child relationships

## File Naming Conventions

### Sections
Format: `{chapterNum}-{section2Num}-{section3Num} {title}.md`
- Level 0 (Chapter): `04-00-00 Chapter Title Page.md`
- Level 1: `04-01-00 A Filename as a Route Segment.md`
- Level 2: `04-01-01 Subsection Name.md`
- Level 3: `04-01-01-01 Deep Subsection.md`

### Chapters
Format: `{chapterNum} {title}`
- Example: `04 Static Routes/`

### Parts
Format: `Part {partNum} - {title}`
- Example: `Part 1 - Getting Started/`

## Heading Formats in Files

- Level 0: `# {chapterNum} {title}`
- Level 1: `## {chapterNum}.{section2Num} {title}`
- Level 2: `### {chapterNum}.{section2Num}.{section3Num} {title}`
- Level 3: `#### {chapterNum}.{section2Num}.{section3Num}.{section4Num} {title}`

## ID Format Specifications

### Section IDs
Format: `{chapterId}-{section2Num}-{section3Num}-{section4Num}`

Examples:
- `chapter-04-01-00-00` - Level 1 section in chapter 4
- `chapter-04-01-02-00` - Level 2 section in chapter 4
- `chapter-04-01-02-03` - Level 3 section in chapter 4
- `intro-00-01-00` - Level 1 section in Introduction
- `appendix-A-01-00-00` - Level 1 section in Appendix A

### Chapter IDs
Format varies by chapter type:
- Standard chapters: `chapter-{chapterNum}` (e.g., `chapter-04`)
- Introduction: `intro` (fixed)
- Appendices: `appendix-{chapterNum}` (e.g., `appendix-A`)

### BookPart IDs
Format: `part-{partNum}`

Examples:
- `part-1` - Part 1
- `part-2` - Part 2

**Note:** IDs are **not** the same format for all entity types. Each type has its own format optimized for its hierarchical position and naming conventions.
