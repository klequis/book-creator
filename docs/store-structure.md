# Store Structure

This document describes the state management architecture in the book-creator application.

## Global Stores (in `src/stores/`)

### `bookStore.ts` - Main Book Data Store
**Type**: `createStore`

**Purpose**: Manages the entire book structure, file operations, and persistence.

**State**:
- `book`: The complete book structure (Book | null) - all parts, chapters, appendices, sections
- `rootPath`: Absolute path to the book directory (string | null)
- `loading`: Loading state for async operations (boolean)
- `error`: Error messages from operations (string | null)
- `dirty`: Tracks unsaved changes (boolean)
- `recentBooks`: List of recently opened books with timestamps (RecentBook[])

**Actions**:
- `loadBook(rootPath)` - Load book from JSON file
- `saveBook()` - Save book to JSON file
- `markDirty()` - Mark as having unsaved changes
- `applySectionUpdates()` - Apply section movements with file system changes
- `addToRecentBooks()`, `removeFromRecentBooks()`, `clearRecentBooks()` - Manage recent books list
- `closeBook()` - Close current book and reset state

**Persistence**: Uses Tauri plugin-store to persist recent books list to `settings.json`.

---

### `errorStore.ts` - Error Panel Management
**Type**: `createSignal`

**Purpose**: Manages persistent error tracking for the error panel UI.

**State**:
- `errors`: Array of error entries (ErrorEntry[])
  - Each entry contains: `id`, `message`, `timestamp`, `stack`, `context`
- `isErrorPanelOpen`: Visibility state of error panel (boolean)

**Actions**:
- `addError(message, error?, context?)` - Add error and auto-open panel
- `clearError(id)` - Remove specific error by ID
- `clearAllErrors()` - Clear all errors
- `getErrors()` - Get reactive signal of error list
- `getIsErrorPanelOpen()` - Get panel visibility state
- `setErrorPanelOpen(open)` - Set panel visibility
- `closeErrorPanel()` - Close panel

**Usage**: All errors from async operations are routed through `showError()` utility which calls `addError()`.

---

### `editorState.ts` - Editor State Tracking
**Type**: `createSignal`

**Purpose**: Tracks the currently open file and save state in the editor.

**State**:
- `currentFilePath`: Path of file currently open in editor (string | null)
- `hasUnsavedChanges`: Whether current file has unsaved changes (boolean)
- `saveCallback`: Registered function to save current file (() => Promise<void> | null)

**Actions**:
- `getCurrentFilePath()` - Get current file path
- `setCurrentFilePath(path)` - Set current file path
- `getHasUnsavedChanges()` - Check if changes exist
- `setHasUnsavedChanges(value)` - Update unsaved state
- `registerSaveCallback(callback)` - Register save function
- `unregisterSaveCallback()` - Unregister save function
- `saveCurrentFile()` - Execute save callback if changes exist

**Usage**: MarkdownEditor registers its save function here; App.tsx uses this to prompt before navigation.

---

## Component-Level Stores

### `MarkdownPreview.tsx`
**Type**: `createStore`

**State**:
- `ast`: Parsed markdown AST (RootNode | null)
- `loading`: Whether AST parsing is in progress (boolean)
- `error`: Error message from parsing (string | null)

**Purpose**: Manages markdown parsing and AST generation for preview rendering.

---

### `ResourcesNode.tsx`
**Type**: `createStore` (used twice - main component + nested component)

**Main component state**:
- `data`: Array of directory entries (FileEntry[])
- `loading`: Whether directory is being read (boolean)
- `error`: Whether read operation failed (boolean)

**Nested ResourceEntry component state**:
- `data`: Array of subdirectory entries (FileEntry[])

**Purpose**: Manages asynchronous directory reading for resources tree navigation.

---

### `MarkdownEditor.tsx`
**Type**: `createSignal` (3 separate signals)

**State**:
- `fileContent`: Content of currently loaded file (string | null)
- `fileLoading`: Whether file is being loaded (boolean)
- `fileError`: Error from file loading (Error | null)

**Purpose**: Manages file loading state for the editor. Uses separate signals instead of a store because these values are managed independently.

---

## Architecture Decisions

### When to use `createStore` vs `createSignal`

**Use `createStore` when**:
- Managing multiple related state fields together (data + loading + error)
- State is a complex nested object that benefits from granular reactivity
- Need fine-grained updates to object properties

**Use `createSignal` when**:
- Managing simple primitive values or arrays
- State fields are truly independent
- Simple top-level updates only

### Error Handling Pattern

All async operations follow this pattern:
1. Try/catch wraps operation
2. On error: call `showError(message, error, context)`
3. `showError()` routes to error panel via `addError()`
4. Error panel auto-opens and persists errors until user dismisses

### State Management Flow

```
User Action
    ↓
Component (local state with createStore/createSignal)
    ↓
Global Store (bookStore, editorState, errorStore)
    ↓
File System (via Tauri invoke)
    ↓
Persistence (settings.json via plugin-store)
```

### Legacy Code

`src/book-store.ts` is legacy code only used in `example-usage.ts` (documentation). The actual application uses `src/stores/bookStore.ts`.
