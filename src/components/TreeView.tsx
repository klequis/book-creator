import { Component, createSignal, Show } from 'solid-js';
import { open } from '@tauri-apps/plugin-dialog';
import type { BookStructure } from '../types/book';
import { bookService } from '../services/bookService';
import { Book } from './Book';
import './TreeView.css';

export const TreeView: Component = () => {
  const [bookPath, setBookPath] = createSignal<string>('');
  const [structure, setStructure] = createSignal<BookStructure | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const loadBook = async (path?: string) => {
    const folderPath = path || bookPath();
    if (!folderPath) return;

    setLoading(true);
    setError(null);

    try {
      const result = await bookService.getStructure(folderPath);
      console.log('Book structure loaded:', JSON.stringify(result, null, 2));
      
      if (!result) {
        setError('Failed to load book structure');
        setStructure(null);
        return;
      }
      
      // Temporarily disabled content check to debug
      // const hasContent = result.parts.length > 0 || result.introduction || result.appendices.length > 0;
      // if (!hasContent) {
      //   setError('Book loaded but no content found. Check the book structure.');
      //   setStructure(null);
      //   return;
      // }
      
      setStructure(result);
      setBookPath(folderPath);
    } catch (err) {
      console.error('Load book error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load book');
      setStructure(null);
    } finally {
      setLoading(false);
    }
  };

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
        await loadBook(selected);
      }
    } catch (err) {
      console.error('Folder picker error:', err);
      setError(err instanceof Error ? err.message : 'Failed to open folder picker');
    }
  };

  return (
    <div class="tree-view">
      <div class="tree-header">
        <button 
          class="browse-button" 
          onClick={selectFolder}
          disabled={loading()}
        >
          {loading() ? '⏳ Loading...' : '📁 Select Book Folder...'}
        </button>
        <Show when={bookPath()}>
          <span class="current-path">{bookPath()}</span>
        </Show>
      </div>

      <Show when={error()}>
        <div class="error-message">{error()}</div>
        <pre style="color: #ccc; font-size: 11px; padding: 12px; overflow: auto; max-height: 400px;">
          Debug info will appear here after selecting a folder
        </pre>
      </Show>

      {/* Debug display */}
      <div style="padding: 12px; color: #858585; font-size: 11px;">
        Structure loaded: {structure() ? 'YES' : 'NO'}
        {structure() && (
          <div>
            Parts: {structure()!.parts.length} | 
            Introduction: {structure()!.introduction ? 'YES' : 'NO'} | 
            Appendices: {structure()!.appendices.length}
          </div>
        )}
      </div>

      <Show when={structure()}>
        {(s) => <Book structure={s()} />}
      </Show>

      <Show when={!loading() && !structure() && !error()}>
        <div class="empty-state">
          <p>Click "Select Book Folder" to get started</p>
        </div>
      </Show>
    </div>
  );
};
