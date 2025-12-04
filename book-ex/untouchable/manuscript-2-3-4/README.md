# Book Tools

## Getting Started

This is a book workspace managed by the Book Tools VS Code extension.

## Available Commands

Use the Command Palette (Ctrl+Shift+P / Cmd+Shift+P) to access:

- **Book Tools: Insert Part** - Add a new part to organize chapters
- **Book Tools: Insert Chapter** - Add a new chapter
- **Book Tools: Insert Section** - Add a new section (choose heading level: ##, ###, or ####)

## Book Structure

### Without Parts

Your book is organized by chapters:
```
NN ChapterName/
  NN-SS-TT-UU filename.md
```

### File Naming Convention

- **NN** = Chapter number
- **SS** = Heading 2 number (00 for main chapter)
- **TT** = Heading 3 number (00 for main chapter or Heading 2)
- **UU** = Heading 4 number (omit or use 00 for higher levels)

### Markdown Hierarchy

Each heading level is a separate file:
- `#` Chapter (maps to folder)
- `##` Heading 2 (separate file)
- `###` Heading 3 (separate file)
- `####` Heading 4 (separate file)

## Learn More

For detailed documentation, visit the [Book Tools repository](https://github.com/klequis/book-tools).
