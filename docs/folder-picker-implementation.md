# Folder Picker Implementation

## Overview
Replace the text input field in TreeView with a native folder picker dialog to select book directories.

## Current State
- TreeView has a text input field for entering book path manually
- User must type or paste the full path
- No validation until "Load Book" is clicked
- Error-prone (typos, invalid paths)

## Proposed Solution
Use Tauri's file dialog API to open a native folder picker.

## Implementation Steps

### 1. Add Tauri Dialog Plugin
**File**: `src-tauri/Cargo.toml`
```toml
[dependencies]
tauri-plugin-dialog = "2"
```

### 2. Register Plugin in Tauri
**File**: `src-tauri/src/lib.rs`
```rust
use tauri_plugin_dialog;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())  // Add this
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_directory,
            // ... other commands
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. Install Frontend API Package
**Command**:
```bash
pnpm add @tauri-apps/plugin-dialog
```

### 4. Update TreeView Component
**File**: `src/components/TreeView.tsx`

**Changes**:
- Remove text input field
- Add "Browse..." button with folder icon
- Import dialog API from `@tauri-apps/plugin-dialog`
- Call `open()` with directory picker options
- Handle selected path (user can cancel)
- Auto-load book after selection (optional)

**Key API**:
```typescript
import { open } from '@tauri-apps/plugin-dialog';

const selectFolder = async () => {
  const selected = await open({
    directory: true,
    multiple: false,
    title: 'Select Book Folder',
  });
  
  if (selected) {
    setBookPath(selected);
    // Optionally auto-load
    loadBook(selected);
  }
};
```

### 5. Update UI Layout
**File**: `src/components/TreeView.tsx` & `src/components/TreeView.css`

**New Layout**:
```
[📁 Browse...]  [Current path or "No book selected"]  [Load Book]
```

Or simpler:
```
[📁 Select Book Folder...]
```
(Auto-loads after selection)

**Styling**:
- Button with folder icon
- Show selected path as read-only text or breadcrumb
- Maintain VS Code dark theme

## Advantages
- Native OS folder picker (familiar UX)
- No manual typing errors
- Path validation (only real directories can be selected)
- Better accessibility
- Cleaner UI

## Edge Cases
- User cancels dialog → no change to current state
- User selects invalid book structure → show error after load attempt
- Remember last selected folder (could store in localStorage)
- Handle permission errors (restricted directories)

## Optional Enhancements
- **Remember Last Path**: Save to localStorage, set as default next time
- **Recent Books**: Dropdown of recently opened books
- **Path Display**: Show just folder name with tooltip for full path
- **Quick Switch**: Button to re-open picker without losing current book

## Testing
1. Click browse button → native dialog opens
2. Select valid book folder → path displays, loads successfully
3. Cancel dialog → no change to current book
4. Select folder without book structure → error message shown
5. Build AppImage → native dialog works in bundled app

## Files to Modify
- `src-tauri/Cargo.toml` - Add dialog plugin dependency
- `src-tauri/src/lib.rs` - Register dialog plugin
- `package.json` - Add @tauri-apps/plugin-dialog (via pnpm add)
- `src/components/TreeView.tsx` - Replace input with button, add picker logic
- `src/components/TreeView.css` - Style browse button and path display

## Estimated Effort
- Setup: 5 minutes (dependencies)
- Implementation: 15-20 minutes (UI changes)
- Testing: 10 minutes
- **Total**: ~30-40 minutes
