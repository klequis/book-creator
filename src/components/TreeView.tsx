import { Component, createSignal, createResource, Show, createEffect, onMount } from 'solid-js';
import { open } from '@tauri-apps/plugin-dialog';
import { load } from '@tauri-apps/plugin-store';
import { bookService } from '../services/bookService';
import { Book } from './Book';
import './TreeView.css';

interface TreeViewProps {
  onFileSelect: (filePath: string | null) => void;
  onZoomChange: (zoom: number) => void;
  onResourcesPathChange: (resourcesPath: string | null) => void;
}

export const TreeView: Component<TreeViewProps> = (props) => {
  const [bookPath, setBookPath] = createSignal<string>('');
  const [zoom, setZoom] = createSignal(180);
  const [refreshTrigger, setRefreshTrigger] = createSignal(0);
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
  
  const [structure] = createResource(
    () => {
      const trigger = refreshTrigger();
      const path = bookPath();
      console.log('[TreeView] Resource source updated:', { path, trigger });
      return [path, trigger] as const;
    },
    async ([path]) => {
      if (!path) return null;
      console.log('[TreeView] Fetching book structure for:', path);
      const result = await bookService.getStructure(path);
      console.log('[TreeView] Book structure loaded. Sections:', result?.sections.length);
      
      // Notify parent of resources path
      props.onResourcesPathChange(result?.resourcesPath || null);
      
      // Save the path when successfully loaded
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
      
      return result;
    }
  );

  createEffect(() => {
      console.log('structure():', structure());
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

  return (
    <div class="tree-view">
      <div class="tree-header">
        <button 
          class="browse-button" 
          onClick={selectFolder}
          disabled={structure.loading}
        >
          {structure.loading ? '⏳ Loading...' : '📁 Select Book Folder...'}
        </button>
        <div class="zoom-controls">
          <button onClick={zoomOut} title="Zoom out">−</button>
          <button onClick={resetZoom} title="Reset zoom">{zoom()}%</button>
          <button onClick={zoomIn} title="Zoom in">+</button>
        </div>
      </div>

      <Show when={structure.error}>
        <div class="error-message">
          {structure.error instanceof Error ? structure.error.message : 'Failed to load book'}
        </div>
      </Show>

      {/* Debug display */}
      <div style="padding: 12px; color: #858585; font-size: 11px;">
        {(() => {
          const hasContent = structure() && (
            structure()!.chapters.length > 0 ||
            structure()!.sections.length > 0
          );
          return `Structure loaded: ${hasContent ? 'YES' : 'NO'}`;
        })()}
        {structure() && (
          <div>
            Book Parts: {structure()!.bookParts.length} | 
            Chapters: {structure()!.chapters.length} | 
            Sections: {structure()!.sections.length}
            <br />
            Introduction: {structure()!.chapters.filter(ch => ch.isIntroduction).length > 0 ? 'YES' : 'NO'} | 
            Appendices: {structure()!.chapters.filter(ch => ch.isAppendix).length}
          </div>
        )}
      </div>

      <div class="tree-content-wrapper" style={{ "font-size": `${zoom()}%` }}>
        <Show when={structure()}>
          {(s) => <Book structure={s()} onFileSelect={props.onFileSelect} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />}
        </Show>

        <Show when={!structure.loading && !structure() && !structure.error}>
          <div class="empty-state">
            <p>Click "Select Book Folder" to get started</p>
          </div>
        </Show>
      </div>
    </div>
  );
};
