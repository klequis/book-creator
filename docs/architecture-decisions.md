# Architecture Decisions

## Data Source: JSON-first

**Decision:** book-structure.json is the source of truth for book structure.

**Rationale:**
- Enables precise control over IDs, order, and parent relationships
- Movement operations modify JSON, then update filesystem to match
- No ambiguity about structure - JSON defines it explicitly
- Filesystem follows JSON, not vice versa

**Implementation:**
1. Load book structure from `book-structure.json` in book root directory
2. All structure modifications update JSON first
3. Filesystem operations (rename files, update headings) follow JSON changes
4. No filesystem scanning to infer structure

**Workflow:**
```
User action → Calculate updates → Apply to JSON → Apply to filesystem → Save JSON
```

**Migration:**
- Old system scanned filesystem to build structure
- New system loads from JSON
- Migration tool needed to convert existing books (future work)
