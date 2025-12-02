# Frontmatter Proposal for Book Files

## Overview

Proposal to add YAML frontmatter to each markdown file containing metadata about the file and its parent relationships.

## Proposed Frontmatter Structure

### Example: Chapter Title Page (Level 0)
```markdown
---
bookPartType: chapter-title
prefix: "04-00-00"
heading: "Static Routes"
parentType: null
parentPrefix: null
---

# 4 Static Routes

Content here...
```

### Example: Level 1 Section
```markdown
---
bookPartType: section
prefix: "04-01-00"
heading: "A Filename as a Route Segment"
parentType: chapter
parentPrefix: "04"
---

## 4.1 A Filename as a Route Segment

Content here...
```

### Example: Level 2 Section
```markdown
---
bookPartType: section
prefix: "04-02-01"
heading: "Nested Routes"
parentType: section
parentPrefix: "04-02"
---

### 4.2.1 Nested Routes

Content here...
```

### Example: Introduction Section
```markdown
---
bookPartType: introduction-section
prefix: "00-01-00"
heading: "Getting Started"
parentType: introduction
parentPrefix: "00"
---

## 0.1 Getting Started

Content here...
```

### Example: Appendix Section
```markdown
---
bookPartType: appendix-section
prefix: "A-01-00"
heading: "Additional Resources"
parentType: appendix
parentPrefix: "A"
---

## A.1 Additional Resources

Content here...
```

## Field Definitions

### Current File Fields

**bookPartType** - Type of this file
- `chapter-title` - Level 0 (chapter title page)
- `section` - Levels 1-3 (regular sections)
- `introduction-section` - Section in Introduction
- `appendix-section` - Section in Appendix

**prefix** - Full numerical prefix from filename
- Format: `NN-SS-TT-UU` (chapter-section2-section3-section4)
- Examples: `04-00-00`, `04-01-00`, `04-02-01-00`
- For appendices: `A-01-00`, `B-02-00`

**heading** - Text portion of the markdown heading (without number prefix)
- Example: `"Static Routes"` from `# 4 Static Routes`
- Example: `"A Filename as a Route Segment"` from `## 4.1 A Filename as a Route Segment`

### Parent File Fields

**parentType** - Type of parent container
- `null` - No parent (chapter title page)
- `chapter` - Parent is a chapter
- `section` - Parent is a section
- `introduction` - Parent is Introduction
- `appendix` - Parent is an Appendix
- `part` - Parent is a Book Part

**parentPrefix** - Numerical prefix of parent
- For sections in chapter: `"04"` (chapter number)
- For nested sections: `"04-01"` (parent section prefix)
- For chapter in part: `"1-04"` (part-chapter)
- `null` for top-level items

## Pros of Using Frontmatter

### 1. **Self-Documenting Files**
- Each file contains its own metadata
- Files are portable and understandable in isolation
- No need to parse filename to understand structure

### 2. **Easier File Operations**
- Renaming files doesn't require updating external database
- Moving files between chapters/sections is simpler
- Copy/paste operations preserve metadata

### 3. **Validation & Verification**
- Can verify file structure matches frontmatter
- Detect inconsistencies between filename and content
- Easier to audit book structure

### 4. **Flexibility**
- Easy to add new metadata fields without schema changes
- Can store additional per-file data (tags, status, author, etc.)
- Standard format (YAML) works with many tools

### 5. **Better Recovery**
- If scanning fails, can rebuild structure from frontmatter
- Less dependent on filename parsing
- Can detect and fix structural issues

### 6. **Tool Compatibility**
- Many markdown processors support frontmatter (Jekyll, Hugo, etc.)
- Could export to other systems more easily
- Standard format for markdown metadata

### 7. **Explicit Parent Relationships**
- Clear parent-child relationships without inference
- Easier to detect orphaned sections
- Simplified tree building logic

### 8. **Versioning**
- Frontmatter is tracked in git
- History of metadata changes visible
- Easier to understand changes over time

## Cons of Using Frontmatter

### 1. **Redundancy**
- Information duplicates what's in filename
- Information duplicates what's in heading
- Could get out of sync with actual file structure

### 2. **Maintenance Burden**
- Must update frontmatter when renaming files
- Must update when moving files to different chapters
- Must update when changing heading text
- More places for bugs/inconsistencies

### 3. **Source of Truth Confusion**
- Which is authoritative: filename, frontmatter, or heading?
- What happens when they disagree?
- Need conflict resolution strategy

### 4. **Migration Cost**
- All existing files need frontmatter added
- Need tool to generate initial frontmatter
- Manual verification likely required

### 5. **User Experience**
- Users see more YAML in files
- Could be confusing for non-technical users
- Extra scrolling to get to content
- Intimidating for simple edits

### 6. **Performance**
- Parsing frontmatter adds overhead
- Larger file sizes (minimal)
- More data to process on each file read

### 7. **Editing Friction**
- Easy to accidentally break YAML syntax
- Need to remember to update when making changes
- Could prevent casual editing

### 8. **Current System Works**
- Filename parsing is already reliable
- Scanning works well
- Adding frontmatter doesn't solve an existing problem

### 9. **Inconsistency Risk**
- Frontmatter says level 1, but filename says level 2
- Frontmatter says parent is chapter 3, but file is in chapter 4
- Need validation to catch these

### 10. **Manual Editing Required**
- Promote/demote operations must update frontmatter
- Rename operations must update frontmatter
- More failure points in operations

## Alternative: Hybrid Approach

Use frontmatter **only** for optional/extended metadata:

```markdown
---
status: draft
lastReviewed: 2025-12-02
tags: [routing, advanced]
---

# 4 Static Routes
```

Keep structure information in filenames and headings (current approach), add frontmatter only for metadata that **can't** be encoded in filename/heading.

## Recommendations

### ❌ **Not Recommended for Structure Data**
- Current filename + heading system works well
- Redundancy creates maintenance burden
- Risk of desynchronization outweighs benefits
- Adding complexity without solving current problems

### ✅ **Recommended for Optional Metadata**
- Use frontmatter for non-structural data
- Fields like: status, tags, author, lastReviewed, notes
- Keeps structural data in one place (filenames)
- Adds value without duplication

### 🤔 **Consider for Future Features**
- Custom display names (different from heading)
- Hide/show sections in output
- Export metadata
- Review/approval workflows
- Content status tracking

## Implementation If Needed

If frontmatter is added for structural data:

1. **Validation Tool Required**
   - Check frontmatter matches filename
   - Check frontmatter matches heading
   - Report inconsistencies

2. **Auto-Update on Operations**
   - Rename operation updates all fields
   - Promote/demote updates bookPartType
   - Move operation updates parent fields

3. **Fallback Strategy**
   - If frontmatter missing, infer from filename
   - If frontmatter conflicts, filename wins
   - Clear precedence rules

4. **Migration Tool**
   - Generate frontmatter for all existing files
   - Verify correctness
   - Batch update operation
