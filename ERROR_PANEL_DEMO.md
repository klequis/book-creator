# Error Panel Implementation

## Overview
A persistent error panel has been added as a 4th resizable panel that:
- ✅ Auto-opens when any error occurs
- ✅ Displays formatted errors with timestamp, message, context, and stack traces
- ✅ Requires manual user action to clear errors
- ✅ Cannot be closed while errors exist
- ✅ Shows expandable error details
- ✅ Integrates with existing error handling throughout the app

## Architecture

### New Files Created

1. **`src/stores/errorStore.ts`** - Error state management
   - `addError(message, error?, context?)` - Add error to panel (auto-opens)
   - `clearError(id)` - Clear single error
   - `clearAllErrors()` - Clear all errors
   - `getErrors()` - Get reactive error list
   - `getIsErrorPanelOpen()` - Get panel visibility state
   - `closeErrorPanel()` - Close panel (only works when no errors)

2. **`src/components/ErrorPanel.tsx`** - Error panel UI component
   - Displays list of errors with timestamps
   - Expandable sections showing context and stack traces
   - Individual error dismissal
   - "Clear All" button
   - Close button (disabled when errors exist)

3. **`src/components/ErrorPanel.css`** - Styling
   - Red accent border on panel
   - Dark theme matching existing UI
   - Collapsible error details
   - Formatted stack traces

### Modified Files

1. **`src/utils/notifications.ts`**
   - `showError()` now routes to error panel instead of toast
   - Success/info notifications remain as temporary toasts
   - Error signature: `showError(message, error?, context?)`

2. **`src/App.tsx`**
   - Added 4th panel (ErrorPanel) that appears when errors occur
   - Panel sizes adjusted: [sidebar: 20%, editor: 35%, preview: 35%, errors: 10%]
   - Error panel is resizable (10%-50% of screen)

3. **`src/App.css`**
   - Added `.error-panel-container` styles

4. **Error handling updated in:**
   - `src/stores/bookStore.ts` - All error calls now pass error objects and context
   - `src/components/SectionNode.tsx` - Movement operation errors include section name
   - `src/components/TreeView.tsx` - File save errors include context

## User Experience

### When an Error Occurs:
1. Error panel automatically slides in from the right
2. Error appears with:
   - 🔴 Red alert icon
   - Clear error message
   - Timestamp (HH:MM:SS)
   - Context description (where it happened)
   - Expandable details (click chevron)
3. Main panels resize to accommodate error panel

### Error Details (Expandable):
- **Context**: Additional info about the operation
- **Stack Trace**: Full error stack for debugging

### Clearing Errors:
- Click ❌ on individual error to dismiss it
- Click "Clear All" button to dismiss all errors
- Once all errors cleared, close button becomes enabled
- Click ❌ close button to hide panel

### Panel Behavior:
- Panel size is persistent (saved to localStorage)
- Resizable using drag handles
- Cannot close while errors exist (button disabled)
- Can resize to focus on errors or minimize distraction

## Testing the Error Panel

To trigger the error panel in development:

1. **File Not Found Error**:
   - Move a section whose file doesn't exist on disk
   - Error panel will show: "File does not exist: [path]"
   - Includes context: "Moving section up: [section name]"

2. **Book Load Error**:
   - Try to load a directory without book-structure.json
   - Error panel shows: "No book-structure.json found in directory"
   - Includes context: "Loading book from: [path]"

3. **Save Error**:
   - Trigger a save operation when no book is loaded
   - Error panel shows: "No book loaded"
   - Includes context: "Attempting to save book"

## Benefits Over Toast Notifications

| Feature | Toast (old) | Error Panel (new) |
|---------|------------|------------------|
| Persistence | ❌ Auto-dismisses | ✅ Stays until cleared |
| Stack traces | ❌ Not available | ✅ Full stack visible |
| Context | ❌ Limited | ✅ Rich context shown |
| Multiple errors | ❌ Overlapping toasts | ✅ Listed in panel |
| User control | ❌ Auto-dismiss | ✅ Manual dismiss only |
| Debug info | ❌ Lost after timeout | ✅ Preserved for review |

## Implementation Notes

- **Separation of Concerns**: Errors go to panel, success/info remain as toasts
- **Type Safety**: Error objects preserve stack traces when available
- **Context Tracking**: Every error includes where it occurred
- **Zero Breaking Changes**: All existing `showError()` calls work (context is optional)
- **Reactive**: Panel auto-opens/closes based on error state
- **Accessible**: Keyboard navigation, ARIA labels, proper focus management
- **Responsive**: Resizable panel adapts to user workflow

## Future Enhancements

Potential improvements:
- [ ] Error severity levels (warning, error, critical)
- [ ] Error filtering/search
- [ ] Export errors to file for bug reports
- [ ] Error statistics/grouping
- [ ] Retry button for recoverable errors
- [ ] Copy error details to clipboard
