# Patterns from Todo Example

Analysis of patterns from `ex-code-01/excode-01.tsx` and their applicability to our file editor.

## Patterns Identified

### 1. No manual isDirty state management
The form just submits. State is derived from submissions rather than tracked manually.

### 2. Using useSubmissions (plural)
Tracks multiple submissions for optimistic UI:
```tsx
const addingTodo = useSubmissions(addTodo);
const removingTodo = useSubmissions(removeTodo);
```

### 3. Optimistic UI from submission state
Shows pending items immediately:
```tsx
<For each={addingTodo}>
  {sub => <li class="todo pending">...</li>}
</For>
```

### 4. Clearing input after submit
Not in onSubmit handler:
```tsx
onSubmit={e => {
  if (!inputRef.value.trim()) e.preventDefault();
  setTimeout(() => (inputRef.value = "")); // Clear AFTER submit
}}
```

### 5. Edit mode uses submission state
```tsx
const editingTodo = useSubmission(editTodo, input => input[0] == todo.id);
const title = () => (editingTodo.pending ? editingTodo.input[0] : todo.title);
```

### 6. No createEffect
Uses `createAsyncStore` instead of `createAsync`, automatically handles refetching.

### 7. Dirty check only when needed
Check on blur instead of tracking continuously:
```tsx
onBlur={e => {
  if (todo.title !== e.currentTarget.value) {
    e.currentTarget.form!.requestSubmit();  // Auto-submit if changed
  } else setTimeout(() => setEditing({}));  // Just close if no change
}}
```

## Applicability to File Editor

### For `[filePath].tsx`:

1. **#1 - No manual isDirty** ✅ Would simplify state management, derive dirty from comparing content
2. **#4 - Clear textarea after action** ✅ Would help reset state when navigating between files
3. **#5 - Use submission state for optimistic UI** ✅ Already partially doing this with `saveSub.pending`
4. **#6 - Remove createEffect** ✅ Could eliminate syncing issues by using `createAsyncStore`
5. **#7 - Check dirty only when needed** ✅ Could check in `onSubmit` instead of tracking continuously

### For rest of project:

2. **#2 - useSubmissions (plural)** - Not applicable yet, but could be useful for batch operations
3. **#3 - Optimistic UI for lists** - Could be useful in BookTree for add/remove operations

## Most Impactful for Current Issues

- **#6 (Remove createEffect)** - Would directly solve "content goes to all files" and "content disappears" problems
- **#1 (No manual isDirty)** - Would simplify timing issues around when to reset isDirty
- **#4 (Clear after action)** - Would help with navigation between files

## Core Principle

Let action and submission state be the source of truth, not manual signals.
