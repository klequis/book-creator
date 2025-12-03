- orderPlus(sectionId: string): void // "order+"
- orderMinus(sectionId: string): void // "order-"
- levelPlus(sectionId: string): void  // "level+"
- levelMinus(sectionId: string): void // "level-"

## Constraints

### S1 Constraints
- S1 cannot order+, order-, level+, or level-
- S1 must always be first in its container (Introduction/Part/Chapter/Appendix)
- **No section can order+ above an S1** (S1 defines the container and must remain first)

### Chapter Boundary
- order+/- operations stay within the current chapter
- Cross-chapter movement is not supported (deferred)

## Smart Movement (Option B)

order+ means "move up in the outline" - can swap with sibling OR promote level if at top of siblings
order- means "move down in the outline" - can swap with sibling OR demote level if at bottom of siblings

## Examples

```
- C1
- C2
  - S1 Title1
    - S2 Title 2
      - S3 Title 3
```

What happens if I order+ S3?
a. should be come sibling of S2?

```
- C1
- C2
  - S1 Title1
    - S2 Title 2
    - S2 Title 3
```

b. should not be able to order+ because it is not a sibling of S2?