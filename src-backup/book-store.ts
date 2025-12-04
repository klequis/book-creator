// SolidJS store for book structure
import { createStore, produce } from 'solid-js/store';
import type { Book, Section } from './types';
import type { SectionUpdate } from './movement-operations';
import { createBookStorage } from './storage';

/**
 * Create a reactive SolidJS store for book management
 */
export function createBookStore(basePath: string) {
  const storage = createBookStorage(basePath);
  
  // Create reactive store
  const [book, setBook] = createStore<Book>({
    chapters: [],
    appendices: []
  });

  const [state, setState] = createStore({
    loaded: false,
    dirty: false,  // Has unsaved changes
    saving: false,
    error: null as string | null
  });

  return {
    // Reactive state
    book,
    state,

    /**
     * Load book from disk into store
     */
    async load() {
      try {
        const loadedBook = await storage.loadBook();
        if (loadedBook) {
          setBook(loadedBook);
          setState({ loaded: true, dirty: false, error: null });
          return true;
        } else {
          setState({ error: 'Book not found' });
          return false;
        }
      } catch (error) {
        setState({ error: String(error) });
        return false;
      }
    },

    /**
     * Save current book state to disk
     */
    async save() {
      setState({ saving: true, error: null });
      try {
        const success = await storage.saveBook(book);
        if (success) {
          setState({ dirty: false, saving: false });
          return true;
        } else {
          setState({ error: 'Failed to save', saving: false });
          return false;
        }
      } catch (error) {
        setState({ error: String(error), saving: false });
        return false;
      }
    },

    /**
     * Create new book
     */
    async createNew(initialData?: Partial<Book>) {
      try {
        const newBook = await storage.createNewBook(initialData);
        setBook(newBook);
        setState({ loaded: true, dirty: false, error: null });
        return true;
      } catch (error) {
        setState({ error: String(error) });
        return false;
      }
    },

    /**
     * Apply section updates from movement operations
     */
    applyUpdates(updates: SectionUpdate[], containerId: string, containerType: 'introduction' | 'chapter' | 'appendix') {
      setBook(produce(draft => {
        // Find the container
        let container: { sections: Section[] } | undefined;
        
        if (containerType === 'introduction' && draft.introduction) {
          container = draft.introduction;
        } else if (containerType === 'chapter') {
          container = draft.chapters.find(c => c.id === containerId);
        } else if (containerType === 'appendix') {
          container = draft.appendices.find(a => a.id === containerId);
        }

        if (!container) {
          throw new Error(`Container ${containerId} not found`);
        }

        // Apply each update
        updates.forEach(update => {
          const section = container.sections.find(s => s.id === update.id);
          if (section) {
            section.level = update.level;
            section.order = update.order;
            section.parentId = update.parentId;
            section.filePath = update.newFilePath;
          }
        });
      }));

      setState({ dirty: true });
    },

    /**
     * Mark as dirty (has unsaved changes)
     */
    markDirty() {
      setState({ dirty: true });
    },

    /**
     * Check if book has unsaved changes
     */
    isDirty(): boolean {
      return state.dirty;
    }
  };
}

export type BookStore = ReturnType<typeof createBookStore>;
