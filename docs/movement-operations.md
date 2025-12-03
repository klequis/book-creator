# Movement Operations

## Overview

Four operations for moving sections within a chapter:
- `orderPlus(sectionId)` - move up in outline
- `orderMinus(sectionId)` - move down in outline
- `levelPlus(sectionId)` - promote (decrease depth)
- `levelMinus(sectionId)` - demote (increase depth)

## Smart Movement (Option B)

`order+/-` operations are context-aware:
- **orderPlus**: Move up in outline - can swap with previous sibling OR promote level if at top of siblings
- **orderMinus**: Move down in outline - can swap with next sibling OR demote level if at bottom of siblings

## Constraints

### S1 Constraints
- **S1 cannot use any operation** (order+, order-, level+, level-)
- **S1 must always be first** in its container (Introduction/Part/Chapter/Appendix)
- **No section can order+ above an S1** (S1 defines the container and must remain first)

### Chapter Boundary
- All operations stay within the current chapter
- Cross-chapter movement is not supported (deferred)

### Level Constraints
- S1 has no parent (level 1, top of chapter)
- S2 parent must be S1 (level 2)
- S3 parent must be S2 (level 3)
- S4 parent must be S3 (level 4)

## Data Model

### Section Type
```typescript
interface Section {
  id: string;              // 8-byte hex: xxxx-xxxx-xxxx-xxxx (immutable)
  level: 1 | 2 | 3 | 4;    // mutable
  filePath: string;        // mutable (derived and stored)
  parentId?: string;       // mutable (undefined for S1)
  order: number;           // mutable
}
```

### Update Type
```typescript
type SectionUpdate = {
  id: string;              // identifies which section to update
  level: 1 | 2 | 3 | 4;    // new level
  order: number;           // new order
  parentId?: string;       // new parent (undefined if becoming top-level)
  filePath: string;        // recalculated file path
}
```

## Operation Flow

### Input
- `sectionId: string` - the id of the section being moved

### Process
1. **Validate** operation is allowed (check constraints)
2. **Determine affected sections** (which sections need updates)
3. **Calculate new values** for each affected section:
   - `level` (if level change occurs)
   - `order` (always changes for moved section, may change for others)
   - `parentId` (changes when level changes)
   - `filePath` (recalculated from new position)
4. **Return array** of `SectionUpdate` objects

### Execute Updates
1. **Update JSON** with new values for all affected sections:
   - `level`
   - `order`
   - `parentId`
   - `filePath`
2. **Rename physical files** to match new `filePath`
3. **Update file content** - first heading prefix to match new outline position

## Examples

### Example 1: orderPlus - Simple Swap

**Before:**
```typescript
[
  {id: 'aaa-1111', level: 2, order: 1, parentId: 'xxx', filePath: '/book/01-chapter/01-first.md'},
  {id: 'bbb-2222', level: 2, order: 2, parentId: 'xxx', filePath: '/book/01-chapter/02-second.md'}
]
```

**Call:** `orderPlus('bbb-2222')`

**Returns:**
```typescript
[
  {id: 'aaa-1111', level: 2, order: 2, parentId: 'xxx', filePath: '/book/01-chapter/02-first.md'},
  {id: 'bbb-2222', level: 2, order: 1, parentId: 'xxx', filePath: '/book/01-chapter/01-second.md'}
]
```

**Result:** Sections swapped positions

### Example 2: orderPlus - Level Promotion

**Before:**
```typescript
[
  {id: 'parent-1', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/01-parent.md'},
  {id: 'child-1', level: 3, order: 1, parentId: 'parent-1', filePath: '/book/01-chapter/02-child.md'}
]
```

**Call:** `orderPlus('child-1')` (child is only child, at top of siblings)

**Returns:**
```typescript
[
  {id: 'parent-1', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/01-parent.md'},
  {id: 'child-1', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/02-child.md'}
]
```

**Result:** Child promoted to sibling of parent

### Example 3: levelPlus - Explicit Promotion

**Before:**
```typescript
[
  {id: 'parent-1', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/01-parent.md'},
  {id: 'child-1', level: 3, order: 1, parentId: 'parent-1', filePath: '/book/01-chapter/02-child-1.md'},
  {id: 'child-2', level: 3, order: 2, parentId: 'parent-1', filePath: '/book/01-chapter/03-child-2.md'}
]
```

**Call:** `levelPlus('child-2')`

**Returns:**
```typescript
[
  {id: 'parent-1', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/01-parent.md'},
  {id: 'child-1', level: 3, order: 1, parentId: 'parent-1', filePath: '/book/01-chapter/02-child-1.md'},
  {id: 'child-2', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-child-2.md'}
]
```

**Result:** child-2 promoted to sibling of parent, child-1 stays under parent

## What Changes

When a section moves, these fields are updated:

1. **`id`** - NEVER CHANGES (immutable, assigned at creation)
2. **`level`** - changes if promoting/demoting
3. **`order`** - always changes for moved section, may change for others (renumbering)
4. **`parentId`** - changes when level changes (new parent or undefined for top-level)
5. **`filePath`** - recalculated from new position and stored (for JSON readability)

## File System Operations

### File Renaming
When `filePath` changes, the physical file must be renamed:
- Old: `/book/01-chapter/02-old-name.md`
- New: `/book/01-chapter/01-old-name.md`

File prefix changes to match new `order` value.

### Heading Update
First heading in file must match outline position:
- Level determined by `level` field (# for S1, ## for S2, etc.)
- Heading prefix derived from walking parent chain
- Example: S3 with order=2 under S2 with order=1 under S1 → `### 1.1.2 Title`

## Edge Cases

### Cannot orderPlus
- Section is S1 (title page)
- Section's previous sibling is S1
- Section is already first among siblings and cannot promote (would violate level constraints)

### Cannot orderMinus
- Section is S1 (title page)
- Section is already last among siblings and cannot demote (would violate level constraints)

### Cannot levelPlus
- Section is S1 (already at top level)
- Section is S2 and promoting would make it S1 (but S1 must be title page)

### Cannot levelMinus
- Section is S4 (maximum depth)
- No valid parent exists at target level
