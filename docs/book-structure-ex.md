# Book Structure Example - New Numbering System

This document shows how books are structured with the new numbering system.

## File Naming Convention

Files use **two-part numbering**: `XX-YY.md`
- `XX` = Container number (00=Introduction, 01-98=Chapters, 99+=Appendices)
- `YY` = Order within container (01, 02, 03...)

## Heading Levels

- `#` = Level 1 (S1) - Container heading (Introduction/Chapter/Appendix)
- `##` = Level 2 (S2) - Major section
- `###` = Level 3 (S3) - Subsection
- `####` = Level 4 (S4) - Sub-subsection

## Example Book Structure

```
book-root/
├── book-structure.json          # JSON source of truth
├── resources/                   # Images, etc.
│
├── Introduction/                # Introduction container
│   ├── 00-01.md                # # 0.1 Introduction (S1 - required)
│   ├── 00-02.md                # ## 0.2 What is Routing (S2)
│   ├── 00-03.md                # ### 0.2.1 Client-side Routing (S3, parent=00-02)
│   └── 00-04.md                # ### 0.2.2 Server-side Routing (S3, parent=00-02)
│
├── 01-the-basics/               # Chapter 1
│   ├── 01-01.md                # # 1.1 The Basics (S1 - required)
│   ├── 01-02.md                # ## 1.2 Getting Started (S2)
│   ├── 01-03.md                # ### 1.2.1 Installation (S3, parent=01-02)
│   ├── 01-04.md                # #### 1.2.1.1 Prerequisites (S4, parent=01-03)
│   └── 01-05.md                # ## 1.3 Your First App (S2)
│
├── 02-advanced-topics/          # Chapter 2
│   ├── 02-01.md                # # 2.1 Advanced Topics (S1 - required)
│   ├── 02-02.md                # ## 2.2 State Management (S2)
│   └── 02-03.md                # ## 2.3 Performance (S2)
│
└── 99-appendix-a/               # Appendix A
    ├── 99-01.md                # # A.1 Appendix A: Resources (S1 - required)
    ├── 99-02.md                # ## A.2 Useful Links (S2)
    └── 99-03.md                # ## A.3 Further Reading (S2)
```

## Example book-structure.json

```json
{
  "introduction": {
    "id": "intro-001",
    "sections": [
      {
        "id": "sect-001",
        "level": 1,
        "filePath": "Introduction/00-01.md",
        "order": 1
      },
      {
        "id": "sect-002",
        "level": 2,
        "filePath": "Introduction/00-02.md",
        "order": 2
      },
      {
        "id": "sect-003",
        "level": 3,
        "filePath": "Introduction/00-03.md",
        "parentId": "sect-002",
        "order": 1
      },
      {
        "id": "sect-004",
        "level": 3,
        "filePath": "Introduction/00-04.md",
        "parentId": "sect-002",
        "order": 2
      }
    ]
  },
  "chapters": [
    {
      "id": "chap-001",
      "sections": [
        {
          "id": "sect-005",
          "level": 1,
          "filePath": "01-the-basics/01-01.md",
          "order": 1
        },
        {
          "id": "sect-006",
          "level": 2,
          "filePath": "01-the-basics/01-02.md",
          "order": 2
        },
        {
          "id": "sect-007",
          "level": 3,
          "filePath": "01-the-basics/01-03.md",
          "parentId": "sect-006",
          "order": 1
        },
        {
          "id": "sect-008",
          "level": 4,
          "filePath": "01-the-basics/01-04.md",
          "parentId": "sect-007",
          "order": 1
        },
        {
          "id": "sect-009",
          "level": 2,
          "filePath": "01-the-basics/01-05.md",
          "order": 3
        }
      ]
    },
    {
      "id": "chap-002",
      "sections": [
        {
          "id": "sect-010",
          "level": 1,
          "filePath": "02-advanced-topics/02-01.md",
          "order": 1
        },
        {
          "id": "sect-011",
          "level": 2,
          "filePath": "02-advanced-topics/02-02.md",
          "order": 2
        },
        {
          "id": "sect-012",
          "level": 2,
          "filePath": "02-advanced-topics/02-03.md",
          "order": 3
        }
      ]
    }
  ],
  "appendices": [
    {
      "id": "appen-001",
      "sections": [
        {
          "id": "sect-013",
          "level": 1,
          "filePath": "99-appendix-a/99-01.md",
          "order": 1
        },
        {
          "id": "sect-014",
          "level": 2,
          "filePath": "99-appendix-a/99-02.md",
          "order": 2
        },
        {
          "id": "sect-015",
          "level": 2,
          "filePath": "99-appendix-a/99-03.md",
          "order": 3
        }
      ]
    }
  ]
}
```

## Key Rules

1. **Every container (Introduction/Chapter/Appendix) MUST have at least one S1 section**
2. **File prefix MUST match heading number** (file `01-02.md` has heading `## 1.2 ...`)
3. **One heading per file** (the file's primary section)
4. **Sections are flat in the array** - hierarchy is via `parentId`
5. **Order determines display sequence** within same level
6. **Folder names** should be lowercase with dashes (e.g., `01-the-basics/`)
7. **IDs are unique** across entire book (8-byte hex format like `a1b2-c3d4-e5f6-7890`)

## Migration from Old System

**Old system** used:
- Filename: `XX-YY-ZZ-WW.md` (chapter-section2-section3-section4)
- Example: `02-01-00-00 Section-3.md`

**New system** uses:
- Filename: `XX-YY.md` (container-order)
- Example: `02-02.md` 
- Hierarchy via `parentId` in JSON, not filename
