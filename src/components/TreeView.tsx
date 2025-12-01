import { Component, createSignal, Show, createEffect, onMount } from 'solid-js';
import { open } from '@tauri-apps/plugin-dialog';
import { load } from '@tauri-apps/plugin-store';
import { bookStore, bookStoreActions } from '../stores/bookStore';
import { editorState } from '../stores/editorState';
import { Book } from './Book';
import { RecentBooksList } from './RecentBooksList';
import { showError, showInfo } from '../utils/notifications';
import './TreeView.css';

interface TreeViewProps {
  onFileSelect: (filePath: string | null) => void;
  onZoomChange: (zoom: number) => void;
  onResourcesPathChange: (resourcesPath: string | null) => void;
}

export const TreeView: Component<TreeViewProps> = (props) => {
  const [bookPath, setBookPath] = createSignal<string>('');
  const [zoom, setZoom] = createSignal(180);
  let store: Awaited<ReturnType<typeof load>> | null = null;

  const saveZoom = async (newZoom: number) => {
    props.onZoomChange(newZoom);
    try {
      if (!store) {
        store = await load('settings.json');
      }
      await store.set('treeZoom', newZoom);
      await store.save();
    } catch (err) {
      console.error('Failed to save tree zoom:', err);
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom() + 10, 300);
    setZoom(newZoom);
    saveZoom(newZoom);
  };
  
  const zoomOut = () => {
    const newZoom = Math.max(zoom() - 10, 50);
    setZoom(newZoom);
    saveZoom(newZoom);
  };
  
  const resetZoom = () => {
    setZoom(180);
    saveZoom(180);
  };
  
  // Load saved book path on mount
  onMount(async () => {
    try {
      store = await load('settings.json');
      const savedPath = await store.get<string>('lastBookPath');
      if (savedPath) {
        console.log('Restored book path:', savedPath);
        setBookPath(savedPath);
        await bookStoreActions.loadBook(savedPath);
      }
      const savedZoom = await store.get<number>('treeZoom');
      if (savedZoom) {
        setZoom(savedZoom);
        props.onZoomChange(savedZoom);
      } else {
        props.onZoomChange(zoom());
      }
    } catch (err) {
      console.error('Failed to load saved path:', err);
    }
  });
  
  // Watch for bookPath changes and load book
  createEffect(async () => {
    const path = bookPath();
    if (path && path !== bookStore.rootPath) {
      await bookStoreActions.loadBook(path);
      
      // Save the path
      try {
        if (!store) {
          store = await load('settings.json');
        }
        await store.set('lastBookPath', path);
        await store.save();
        console.log('Saved book path to store');
      } catch (err) {
        console.error('Failed to save path:', err);
      }
    }
  });

  // Notify parent of resources path changes
  createEffect(() => {
    props.onResourcesPathChange(bookStore.resourcesPath);
  });

  const selectFolder = async () => {
    try {
      console.log('Opening folder picker...');
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Book Folder',
      });

      console.log('Selected:', selected);
      
      if (selected && typeof selected === 'string') {
        setBookPath(selected);
      }
    } catch (err) {
      console.error('Folder picker error:', err);
    }
  };

  const handleSelectRecentBook = async (path: string) => {
    // Check for unsaved changes
    if (editorState.getHasUnsavedChanges()) {
      const fileName = editorState.getCurrentFilePath()?.split('/').pop() || 'current file';
      showInfo(`Saving ${fileName}...`);
      
      const saved = await editorState.saveCurrentFile();
      if (!saved) {
        showError('Failed to save current file. Please save manually before switching books.');
        return;
      }
    }
    
    // Close current book and open new one
    bookStoreActions.closeBook();
    setBookPath(path);
  };

  return (
    <div class="tree-view">
      <div class="tree-header">
        <button 
          class="browse-button" 
          onClick={selectFolder}
          disabled={bookStore.loading}
        >
          {bookStore.loading ? '⏳ Loading...' : '📁 Select Book Folder...'}
        </button>
        <div class="zoom-controls">
          <button onClick={zoomOut} title="Zoom out">−</button>
          <button onClick={resetZoom} title="Reset zoom">{zoom()}%</button>
          <button onClick={zoomIn} title="Zoom in">+</button>
        </div>
      </div>

      <RecentBooksList onSelectBook={handleSelectRecentBook} />

      <Show when={bookStore.error}>
        <div class="error-message">
          {bookStore.error}
        </div>
      </Show>

      {/* Debug display */}
      <div style="padding: 12px; color: #858585; font-size: 11px;">
        {(() => {
          const hasContent = bookStore.chapters.length > 0 || bookStore.sections.length > 0;
          return `Structure loaded: ${hasContent ? 'YES' : 'NO'}`;
        })()}
        <Show when={bookStore.rootPath}>
          <div>
            Book Parts: {bookStore.bookParts.length} | 
            Chapters: {bookStore.chapters.length} | 
            Sections: {bookStore.sections.length}
            <br />
            Introduction: {bookStore.chapters.filter(ch => ch.isIntroduction).length > 0 ? 'YES' : 'NO'} | 
            Appendices: {bookStore.chapters.filter(ch => ch.isAppendix).length}
          </div>
        </Show>
      </div>

      <div class="tree-content-wrapper" style={{ "font-size": `${zoom()}%` }}>
        <Show when={bookStore.rootPath && !bookStore.loading}>
          <Book 
            structure={bookStore} 
            onFileSelect={props.onFileSelect} 
          />
        </Show>

        <Show when={!bookStore.loading && !bookStore.rootPath && !bookStore.error}>
          <div class="empty-state">
            <p>Click "Select Book Folder" to get started</p>
          </div>
        </Show>
      </div>
    </div>
  );
};
