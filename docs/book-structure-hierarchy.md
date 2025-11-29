# Book Structure Hierarchy

## Interface Relationships

```
BookStructure
├── rootPath: string
├── introduction?: ChapterMetadata (optional, single)
├── parts: PartMetadata[] (array of parts)
└── appendices: ChapterMetadata[] (array of chapters)

PartMetadata
├── folderPath: string
├── folderName: string
├── partNum: string (e.g., "01", "02")
├── title: string
└── chapters: ChapterMetadata[] (array of chapters in this part)

ChapterMetadata
├── folderPath: string
├── folderName: string
├── chapterNum: string (e.g., "01", "02")
├── title: string
└── sections: SectionMetadata[] (array of markdown files in this chapter)

SectionMetadata
├── filePath: string
├── fileName: string
├── title: string
├── chapterNum: string
├── section2Num: string (e.g., "01" from 01-01-00)
├── section3Num: string (e.g., "02" from 01-01-02)
├── section4Num: string (e.g., "03" from 01-01-02-03)
├── displayLabel: string
└── level: number (0=chapter, 1=section2, 2=section3, 3=section4)
```

## Example Structure

```typescript
BookStructure {
  rootPath: "/home/user/my-book",
  
  introduction: ChapterMetadata {
    folderPath: "/home/user/my-book/Introduction",
    folderName: "Introduction",
    chapterNum: "00",
    title: "Introduction",
    sections: [
      SectionMetadata {
        chapterNum: "00",
        section2Num: "00",
        section3Num: "00",
        section4Num: "00",
        level: 0,
        title: "Welcome",
        displayLabel: "Welcome"
      }
    ]
  },
  
  parts: [
    PartMetadata {
      folderPath: "/home/user/my-book/Part 01",
      folderName: "Part 01",
      partNum: "01",
      title: "Getting Started",
      chapters: [
        ChapterMetadata {
          folderPath: "/home/user/my-book/Part 01/01 The Basics",
          folderName: "01 The Basics",
          chapterNum: "01",
          title: "The Basics",
          sections: [
            SectionMetadata {
              chapterNum: "01",
              section2Num: "00",
              section3Num: "00",
              section4Num: "00",
              level: 0,
              title: "The Basics",
              displayLabel: "The Basics"
            },
            SectionMetadata {
              chapterNum: "01",
              section2Num: "01",
              section3Num: "00",
              section4Num: "00",
              level: 1,
              title: "Getting Started",
              displayLabel: "Getting Started"
            }
          ]
        }
      ]
    }
  ],
  
  appendices: [
    ChapterMetadata {
      folderPath: "/home/user/my-book/Appendices/A Resources",
      folderName: "A Resources",
      chapterNum: "A",
      title: "Resources",
      sections: [
        SectionMetadata {
          chapterNum: "A",
          section2Num: "00",
          section3Num: "00",
          section4Num: "00",
          level: 0,
          title: "Resources",
          displayLabel: "Resources"
        }
      ]
    }
  ]
}
```

## Hierarchy Flow

1. **BookStructure** (root) → contains Parts, Introduction, Appendices
2. **PartMetadata** → groups multiple Chapters together
3. **ChapterMetadata** → represents a folder containing markdown files
4. **SectionMetadata** → individual .md files with hierarchical numbering

## Key Concepts

### Level Hierarchy
- **Level 0**: Chapter file (NN-00-00-00 Title.md)
- **Level 1**: Section 2 (NN-01-00-00 Title.md)
- **Level 2**: Section 3 (NN-01-01-00 Title.md)
- **Level 3**: Section 4 (NN-01-01-01 Title.md)

### Numbering Scheme
- `chapterNum`: Chapter identifier (e.g., "01", "02", or "A" for appendices)
- `section2Num`: Second-level section number
- `section3Num`: Third-level section number
- `section4Num`: Fourth-level section number

### Special Cases
- **Introduction**: Single ChapterMetadata, no part wrapper
- **Standalone Chapters**: Chapters without Part folders are wrapped in virtual PartMetadata
- **Appendices**: Array of ChapterMetadata, typically using letter identifiers (A, B, C)
