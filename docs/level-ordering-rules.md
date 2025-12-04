# Section Movement Operations

## API

```typescript
- orderPlus(sectionId: string, sections: Section[]): SectionUpdate[]
- orderMinus(sectionId: string, sections: Section[]): SectionUpdate[]
- levelPlus(sectionId: string, sections: Section[]): SectionUpdate[]
- levelMinus(sectionId: string, sections: Section[]): SectionUpdate[]
```

All functions return `SectionUpdate[]` which contains changes to apply to both the section data and file system:

```typescript
interface SectionUpdate {
  id: string
  level: 1 | 2 | 3 | 4
  order: number
  parentId?: string
  oldFilePath: string
  newFilePath: string
}
```

## Constraints

### S1 (Title Page) Constraints
- **S1 cannot move** - No order+, order-, level+, or level- operations allowed
- S1 must always be first in its container (Introduction/Part/Chapter/Appendix)
- No section can order+ above an S1 (enforced: throws error)
- Only one S1 per container (title page)

### Level Constraints
- **Cannot promote to S1** - Only title pages can be S1 level
- **Cannot promote S2 to S1** - Throws error "Cannot promote S2 to S1 - S1 must be title page"
- **Cannot demote S4** - Maximum depth is 4 levels (S4 is already at max)
- S2 can only have S1 as parent
- S3 can only have S2 as parent  
- S4 can only have S3 as parent

### Chapter Boundaries
- order+/- operations stay within current chapter
- Cross-chapter movement not supported

## Smart Movement Behavior

### orderPlus (Move Up)
**"Move up in the outline"** - Smart operation that chooses between swap or promote:

1. **If has previous sibling** → Swap order with previous sibling
   - Exception: Cannot swap above S1 (throws error)
2. **If at top of siblings** → Promote one level (becomes sibling of parent)
   - Exception: Cannot promote to S1 level (throws error)

### orderMinus (Move Down)  
**"Move down in the outline"** - Smart operation that chooses between swap or demote:

1. **If has next sibling** → Swap order with next sibling
2. **If at bottom of siblings** → Demote one level (becomes child of previous sibling)
   - Special case: First S2 child can demote to S3 under S1 parent even without previous sibling
   - Otherwise requires previous sibling to become parent

### levelPlus (Explicit Promote)
**Become sibling of parent** - Always promotes one level:

- Cannot promote S1 (throws error)
- Cannot promote S2 to S1 (throws error) 
- Becomes sibling of parent, inserted after parent
- Subsequent siblings of grandparent are renumbered

### levelMinus (Explicit Demote)
**Become child of previous sibling** - Always demotes one level:

- Cannot demote S1 (throws error)
- Cannot demote S4 (already at max depth, throws error)
- Special case: First S2 can demote to S3 under S1 parent
- Otherwise: Becomes child of previous sibling
- If no previous sibling and not special case, throws error

## Examples

### Example 1: orderPlus with previous sibling

**Before:**
```
Chapter
  S1 Title
    S2 Section A (order: 1)
    S2 Section B (order: 2) ← orderPlus here
    S2 Section C (order: 3)
```

**After (swap with previous sibling):**
```
Chapter
  S1 Title
    S2 Section B (order: 1)
    S2 Section A (order: 2)
    S2 Section C (order: 3)
```

### Example 2: orderPlus at top of siblings

**Before:**
```
Chapter
  S1 Title
    S2 Section A (order: 1) ← orderPlus here
      S3 Subsection 1
    S2 Section B (order: 2)
```

**After (promote level):**
```
Chapter
  S1 Title
  S2 Section A (order: 2) ← Now sibling of S1
    S3 Subsection 1
  S2 Section B (order: 3)  ← Renumbered
```

### Example 3: orderMinus at bottom of siblings

**Before:**
```
Chapter
  S1 Title
    S2 Section A (order: 1)
    S2 Section B (order: 2) ← orderMinus here
```

**After (demote level):**
```
Chapter
  S1 Title
    S2 Section A (order: 1)
      S3 Section B (order: 1) ← Now child of previous sibling
```

### Example 4: Cannot orderPlus above S1

**Before:**
```
Chapter
  S1 Title (order: 0)
  S2 Section A (order: 1) ← orderPlus here
```

**Result:** Throws error "Cannot move above S1 (title page)"

### Example 5: levelMinus special case

**Before:**
```
Chapter
  S1 Title
    S2 First Section (order: 1) ← levelMinus here (first S2, no previous sibling)
```

**After (becomes S3 under S1):**
```
Chapter
  S1 Title
    S3 First Section (order: 1) ← Demoted to S3 under parent S1
```

### Example 6: Answer to "What happens if I order+ S3?"

**Before:**
```
Chapter
  S1 Title
    S2 Section 2
      S3 Section 3 ← orderPlus here
```

**Answer:** It promotes to become a sibling of S2 (option a from the original question)

**After:**
```
Chapter
  S1 Title
    S2 Section 2
    S2 Section 3 ← Promoted to S2, sibling of original S2
```

## Helper Functions

The implementation uses these helper functions internally:

- `getSiblings(section, sections)`: Returns all siblings (same parentId, sorted by order)
- `getParent(section, sections)`: Returns the parent section (by parentId)
- `swapSiblings(s1, s2, sections)`: Exchanges order values between two siblings
- `promoteLevel(section, sections)`: Moves section to become sibling of parent
- `demoteLevel(section, sections)`: Moves section to become child of previous sibling
- `calculateFilePath(currentPath, newOrder)`: Updates filename prefix based on new order

## File Path Updates

When sections move, their file paths are updated to reflect new order:
- `calculateFilePath(currentPath, newOrder)` updates the numeric prefix
- Example: `02-section.md` with new order 3 → `03-section.md`
- The actual file rename must be performed by the caller using `SectionUpdate.oldFilePath` and `SectionUpdate.newFilePath`

## Implementation Location

This behavior is fully implemented in `/src-backup/movement-operations.ts` (Tauri app).

It has NOT yet been ported to the new Electron app but exists as reference for future implementation.
