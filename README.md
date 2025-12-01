# Book Creator

A desktop application for managing markdown-based book structures with hierarchical organization, built with Tauri, SolidJS, and TypeScript.

## Features

- **Tree View**: Hierarchical display of book structure (Parts → Chapters → Sections)
- **File Scanning**: Automatic detection of book structure from folder/file naming patterns
- **Book Format**: Support for Introduction, Parts, Chapters, Appendices, and multi-level sections
- **Fast Performance**: Native desktop performance with small binary size (~10MB)

## Book Structure Format

Books use a hierarchical folder structure:

```
Introduction/                  # Optional intro
  00-00-00 Introduction.md
Part 01 Basics/
  01 The Basics/
    ├── 01-00-00 The Basics.md
    └── 01-01-00 Section.md
Appendices/                    # Optional appendices
  A Creating the Project/
    └── A-00-00 Creating the Project.md
```

### File Naming

- **Chapter folders**: `NN ChapterName` (e.g., `01 Introduction`)
- **Part folders**: `Part NN Name` (e.g., `Part 01 Basics`)
- **Files**: `NN-SS-TT-UU Title.md` where:
  - `NN` = Chapter number (matches folder)
  - `SS` = Heading 2 number (00 for main chapter)
  - `TT` = Heading 3 number
  - `UU` = Heading 4 number

## Tech Stack

- **Frontend**: SolidJS 1.9+ with TypeScript
- **Build Tool**: Vite 6+
- **Desktop**: Tauri 2.x
- **Backend**: Rust (Tauri commands)

## Development

### Prerequisites

- Node.js 18+ (via fnm or nvm)
- Rust 1.70+
- pnpm 8+
- Linux: webkit2gtk, librsvg2 (installed)

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm tauri dev

# Build for production
pnpm tauri build
```

### Project Structure

```
src/
  components/       # SolidJS UI components
  services/         # Business logic (book scanning)
  types/           # TypeScript interfaces
  App.tsx          # Root component
  main.tsx         # Entry point

src-tauri/
  src/
    lib.rs         # Tauri commands
    main.rs        # Entry point
  tauri.conf.json  # Tauri configuration
  Cargo.toml       # Rust dependencies
```

## Available Commands

Tauri commands exposed to frontend:

- `read_directory(path)` - List directory contents
- `read_file(path)` - Read file contents
- `write_file(path, contents)` - Write file
- `create_directory(path)` - Create directory
- `delete_file(path)` - Delete file
- `delete_directory(path)` - Delete directory recursively
- `rename_path(old_path, new_path)` - Rename/move file or directory

## Ported from VS Code Extension

This application is a rewrite of a VS Code extension, porting:

- Book scanning and parsing logic
- Book structure types and interfaces
- File naming pattern validation
- Display label generation

**What's different:**
- No keyboard event workarounds needed
- Direct file system access (no VS Code API)
- Faster development without platform limitations
- Smaller distribution size (~10MB vs 100MB+ for VS Code)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT

## Author

Carl Becker
