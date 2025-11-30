import { Component, createSignal, createResource, Show, createEffect } from 'solid-js';
import { open } from '@tauri-apps/plugin-dialog';
import { bookService } from '../services/bookService';
import { Book } from './Book';
import './TreeView.css';

export const TreeView: Component = () => {
  const [bookPath, setBookPath] = createSignal<string>('');
  
  const [structure] = createResource(bookPath, async (path) => {
    if (!path) return null;
    console.log('Fetching book structure for:', path);
    const result = await bookService.getStructure(path);
    console.log('Book structure loaded:', JSON.stringify(result, null, 2));
    return result;
  });

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
        <Show when={bookPath()}>
          <span class="current-path">{bookPath()}</span>
        </Show>
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

      <Show when={structure()}>
        {(s) => <Book structure={s()} />}
      </Show>

      <Show when={!structure.loading && !structure() && !structure.error}>
        <div class="empty-state">
          <p>Click "Select Book Folder" to get started</p>
        </div>
      </Show>
    </div>
  );
};
