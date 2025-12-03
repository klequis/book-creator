// Example usage of book storage and store

import { createBookStore } from './book-store';
import { orderPlus, orderMinus, levelPlus, levelMinus } from './movement-operations';

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

    // Apply to store (updates UI immediately)
    bookStore.applyUpdates(updates, chapterId, 'chapter');

    // TODO: Also need to rename physical files here
    // await renameFiles(updates);

    // Save to disk
    await bookStore.save();
  } catch (error) {
    console.error('Failed to move section:', error);
  }
}

// Auto-save on changes (optional)
// setInterval(() => {
//   if (bookStore.isDirty()) {
//     bookStore.save();
//   }
// }, 30000); // every 30 seconds
