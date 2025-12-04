# Context + Store Architecture

## Overview

This application uses SolidJS Context API combined with Solid Stores to manage global state and avoid prop drilling. The primary context is `BookContext`, which provides book structure, state, and actions to all components in the tree.

## Why Context + Store?

### Problems Solved
1. **Prop Drilling** - Previously `onFileSelect` and `rootPath` were passed through Book → ChapterNode → SectionNode
2. **Scalability** - Easy to add new actions (movement operations, file operations) without modifying intermediate components
3. **Fine-grained Reactivity** - Stores provide granular reactivity; only components using specific properties re-render
4. **Centralized State** - Single source of truth for book data and selected file

### SolidJS Recommendation
From the [SolidJS documentation](https://docs.solidjs.com/reference/component-apis/create-context#usage):
> **Complex Types**: When passing multiple values (as an `array` or `object`), it is recommended to use a [store](https://docs.solidjs.com/reference/component-apis/create-context#usage).

## Architecture

### BookContext Structure

```typescript
interface BookState {
  book: Book;              // The entire book structure (chapters, sections)
  rootPath: string;        // Base path to book directory
  selectedFile: string | null;  // Currently selected file path
}

interface BookActions {
  onFileSelect: (filePath: string) => void;  // File selection handler
  // Future: onOrderPlus, onOrderMinus, onLevelPlus, onLevelMinus
}

type BookContextValue = [
  state: BookState,
  setState: SetStoreFunction<BookState>,
  actions: BookActions
];
```

### Context Provider

Located in `src/contexts/BookContext.tsx`:

```typescript
export const BookProvider: ParentComponent<{
  book: Book;
  rootPath: string;
  onFileSelect: (filePath: string) => void;
}> = (props) => {
  const [state, setState] = createStore<BookState>({
    book: props.book,
    rootPath: props.rootPath,
    selectedFile: null
  });

  const actions: BookActions = {
    onFileSelect: (filePath: string) => {
      setState("selectedFile", filePath);
      props.onFileSelect(filePath);
    }
  };

  return (
    <BookContext.Provider value={[state, setState, actions]}>
      {props.children}
    </BookContext.Provider>
  );
};
```

### Custom Hook

```typescript
export function useBook(): BookContextValue {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within BookProvider");
  }
  return context;
}
```

**Why a custom hook?**
1. **Type Safety** - Guarantees context is available (no `undefined`)
2. **Better Errors** - Clear error message if used outside provider
3. **Convenience** - Single import instead of importing both `useContext` and `BookContext`

## Usage Patterns

### Setting Up the Provider

In `src/routes/index.tsx`:

```typescript
<BookProvider 
  book={bookData().book!}
  rootPath={bookData().rootPath!}
  onFileSelect={handleFileSelect}
>
  <Book />
</BookProvider>
```

### Accessing State (Read-only)

```typescript
const [bookState] = useBook();
console.log(bookState.rootPath);
console.log(bookState.selectedFile);
console.log(bookState.book.chapters);
```

### Updating State

```typescript
const [bookState, setBookState] = useBook();
setBookState("selectedFile", "/path/to/file");
```

### Using Actions

```typescript
const [, , bookActions] = useBook();
bookActions.onFileSelect(fullPath);
```

### Destructuring Pattern

```typescript
// Get only what you need
const [bookState, , bookActions] = useBook();

// Use state
const path = `${bookState.rootPath}/${section.filePath}`;

// Call action
bookActions.onFileSelect(path);
```

## Component Refactoring

### Before (Prop Drilling)

```typescript
// index.tsx
<Book 
  book={bookData().book!} 
  onFileSelect={handleFileSelect}
  rootPath={bookData().rootPath!}
/>

// Book.tsx
interface BookProps {
  book: Book;
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}
export const Book: Component<BookProps> = (props) => {
  // Pass props down...
  <ChapterNode {...props} chapter={chapter} />
}

// ChapterNode.tsx
interface ChapterNodeProps {
  chapter: Chapter;
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}
// Pass props down again...

// SectionNode.tsx
interface SectionNodeProps {
  section: Section;
  allSections: Section[];
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}
// Finally use the props!
```

### After (Context)

```typescript
// index.tsx
<BookProvider {...props}>
  <Book />
</BookProvider>

// Book.tsx
export const Book: Component = () => {
  const [bookState] = useBook();
  // Access bookState.book directly
}

// ChapterNode.tsx
interface ChapterNodeProps {
  chapter: Chapter;  // Only needs chapter!
}
// No prop drilling

// SectionNode.tsx
interface SectionNodeProps {
  section: Section;
  allSections: Section[];  // Only needs section data!
}
const [bookState, , bookActions] = useBook();
// Access rootPath and onFileSelect from context
```

## Benefits Demonstrated

### 1. Cleaner Props
- **Book.tsx**: No props → All from context
- **ChapterNode.tsx**: Only `chapter` prop
- **SectionNode.tsx**: Only `section` and `allSections` props

### 2. No Intermediate Passing
ChapterNode doesn't care about `onFileSelect` or `rootPath` - it doesn't use them. Before, it had to receive and pass them down anyway.

### 3. Easy to Extend
When we add movement operations:

```typescript
// Just update BookContext.tsx
interface BookActions {
  onFileSelect: (filePath: string) => void;
  onOrderPlus: (sectionId: string) => void;   // Add this
  onOrderMinus: (sectionId: string) => void;  // Add this
  onLevelPlus: (sectionId: string) => void;   // Add this
  onLevelMinus: (sectionId: string) => void;  // Add this
}

// SectionNode.tsx can immediately use them
const [, , bookActions] = useBook();
bookActions.onOrderPlus(section.id);

// Book.tsx and ChapterNode.tsx need NO changes!
```

### 4. Fine-grained Reactivity

```typescript
// Only components using selectedFile will re-render when it changes
setBookState("selectedFile", newPath);

// Only components accessing book structure re-render when book updates
setBookState("book", newBookStructure);
```

## Future Extensions

### Movement Operations

```typescript
const actions: BookActions = {
  onFileSelect: (filePath: string) => { /* ... */ },
  
  onOrderPlus: async (sectionId: string) => {
    const updates = orderPlus(sectionId, bookState.book.chapters);
    // Apply updates, rename files, update book structure
    setBookState("book", updatedBook);
  },
  
  // Similar for onOrderMinus, onLevelPlus, onLevelMinus
};
```

### Loading State

```typescript
interface BookState {
  book: Book;
  rootPath: string;
  selectedFile: string | null;
  isLoading: boolean;  // Add loading state
  error: string | null;  // Add error state
}
```

### Undo/Redo

```typescript
interface BookState {
  book: Book;
  rootPath: string;
  selectedFile: string | null;
  history: Book[];  // Store previous states
  historyIndex: number;
}

const actions: BookActions = {
  // ...
  undo: () => {
    if (bookState.historyIndex > 0) {
      setBookState("historyIndex", i => i - 1);
      setBookState("book", bookState.history[bookState.historyIndex - 1]);
    }
  },
  redo: () => { /* ... */ }
};
```

## Best Practices

### 1. Keep Provider High in Tree
Place `BookProvider` as close to the root as possible but **inside** data loading boundaries (Suspense, Match).

### 2. Use Custom Hook
Always use `useBook()` instead of `useContext(BookContext)` - better errors and types.

### 3. Destructure Minimally
Only destructure what you need:
```typescript
// Good - only takes state
const [bookState] = useBook();

// Good - only takes actions
const [, , bookActions] = useBook();

// Avoid - takes everything even if not needed
const [bookState, setBookState, bookActions] = useBook();
```

### 4. Actions for Side Effects
Put complex logic in actions, not components:
```typescript
// Good - action handles complexity
const actions: BookActions = {
  onFileSelect: async (filePath: string) => {
    setState("selectedFile", filePath);
    props.onFileSelect(filePath);
    // Could add: tracking, validation, logging, etc.
  }
};

// Avoid - component does too much
const handleClick = async () => {
  setState("selectedFile", path);
  props.onFileSelect(path);
  // validation logic
  // tracking logic
  // etc...
};
```

### 5. Default Values
For TypeScript strictness, consider adding a default value to `createContext`:
```typescript
const BookContext = createContext<BookContextValue>([
  { book: emptyBook, rootPath: "", selectedFile: null },
  () => {},
  { onFileSelect: () => {} }
]);
```

## References

- [SolidJS Context Concepts](https://docs.solidjs.com/concepts/context)
- [createContext API](https://docs.solidjs.com/reference/component-apis/create-context)
- [useContext API](https://docs.solidjs.com/reference/component-apis/use-context)
- [Solid Stores](https://docs.solidjs.com/concepts/stores)

## Implementation Files

- **Context Definition**: `src/contexts/BookContext.tsx`
- **Provider Usage**: `src/routes/index.tsx`
- **Consumer Examples**: 
  - `src/components/Book.tsx`
  - `src/components/ChapterNode.tsx`
  - `src/components/SectionNode.tsx`
