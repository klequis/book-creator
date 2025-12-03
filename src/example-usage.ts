// Example usage of book storage and store

import { createBookStore } from './book-store';
import { orderPlus, orderMinus, levelPlus, levelMinus } from './movement-operations';
import { applyFileSystemChanges, validateFilesExist } from './file-operations';

// Create store pointing to book directory
const bookStore = createBookStore('/path/to/book-project');

// Load book at startup
await bookStore.load();

// Access reactive book data in SolidJS components
// bookStore.book.chapters
// bookStore.book.introduction
// bookStore.state.dirty

// Example: User clicks "move up" button on a section
async function handleMoveUp(sectionId: string, chapterId: string) {
  try {
    // Find the chapter
    const chapter = bookStore.book.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    // Calculate updates
    const updates = orderPlus(sectionId, chapter.sections);

    // Validate files exist before making changes
    const filesValid = await validateFilesExist(updates);
    if (!filesValid) {
      throw new Error('Some files do not exist');
    }

    // Apply filesystem changes (rename files, update headings)
    await applyFileSystemChanges(updates, chapter.sections);

    // Apply to store (updates UI immediately)
    bookStore.applyUpdates(updates, chapterId, 'chapter');

    // Save JSON to disk
    await bookStore.save();
  } catch (error) {
    console.error('Failed to move section:', error);
    // TODO: Show error to user, possibly rollback
  }
}

// Auto-save on changes (optional)
// setInterval(() => {
//   if (bookStore.isDirty()) {
//     bookStore.save();
//   }
// }, 30000); // every 30 seconds
