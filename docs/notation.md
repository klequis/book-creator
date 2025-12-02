# Notation

## Abbreviations
- `I` = Introduction
- `P` = Part
- `C` = Chapter
- `S` = Section
- `A` = Appendix
- `[]` = array/collection
- `?` = optional

## Section Levels (markdown heading)
- S1 (Level 1): `#` - Title page (always exactly one per I/P/C/A)
- S2 (Level 2): `##` - Section
- S3 (Level 3): `###` - Section
- S4 (Level 4): `####` - Section

## Structure

**Book:**
```
Book: {
    introduction?: I
    parts?: P[]
    chapters: C[]
    appendices: A[]
}
```

**Elements:**
```
I: { sections: S[] }    // S1 (required), S2, S3, S4 (optional)
P: { 
    sections: S[]       // Only S1 (title page). Cannot have S2, S3, S4
    chapters: C[] 
}
C: { sections: S[] }    // S1 (required), S2, S3, S4 (optional)
A: { sections: S[] }    // S1 (required), S2, S3, S4 (optional)
S: { 
    level: 1 | 2 | 3 | 4
    filePath: string
    parentId?: string
}
```

## Rules

**Sections:**
- All sections (S1-S4) are files with a `filePath`
- `S[]` is a flat array containing all sections for that element
- Section nesting is represented via `parentId`, not nested arrays
- Section hierarchy is built at runtime from the flat array

**Section Requirements:**
- **Part**: Must have exactly 1 section (S1 title page only)
- **Introduction/Chapter/Appendix**: Must have exactly 1 S1 (title page), may have any number of S2, S3, S4

**Section Nesting:**
- S1 has no parent (`parentId` is undefined)
- S2 can only have S1 as parent
- S3 can only have S2 as parent
- S4 can only have S3 as parent
- S4 cannot have children

**Section Ordering:**
- Siblings (sections with same parent) are ordered using the `order` field
- `order` represents position among siblings: 1, 2, 3, etc.
