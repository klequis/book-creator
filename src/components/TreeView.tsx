import { Component, createSignal, createEffect, For, Show } from 'solid-js';
import type { BookStructure } from '../types/book';
import { bookService } from '../services/bookService';
import { PartNode } from './PartNode';
import './TreeView.css';

export const TreeView: Component = () => {
  const [bookPath, setBookPath] = createSignal<string>('');
  const [structure, setStructure] = createSignal<BookStructure | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const loadBook = async () => {
    const path = bookPath();
    if (!path) return;

    setLoading(true);
    setError(null);

    try {
      const result = await bookService.getStructure(path);
      setStructure(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book');
      setStructure(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      loadBook();
    }
  };

  return (
    <div class="tree-view">
      <div class="tree-header">
        <input
          type="text"
          class="book-path-input"
          placeholder="Enter book folder path..."
          value={bookPath()}
          onInput={(e) => setBookPath(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          class="load-button" 
          onClick={loadBook}
          disabled={loading() || !bookPath()}
        >
          {loading() ? 'Loading...' : 'Load Book'}
        </button>
      </div>

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Show when={structure()}>
        {(book) => (
          <div class="tree-content">
            {/* Introduction */}
            <Show when={book().introduction}>
              {(intro) => (
                <PartNode 
                  part={{
                    folderPath: intro().folderPath,
                    folderName: 'Introduction',
                    partNum: '',
                    title: 'Introduction',
                    chapters: [intro()]
                  }}
                  isIntroduction={true}
                />
              )}
            </Show>

            {/* Parts and Chapters */}
            <For each={book().parts}>
              {(part) => <PartNode part={part} />}
            </For>

            {/* Appendices */}
            <Show when={book().appendices.length > 0}>
              <PartNode 
                part={{
                  folderPath: book().rootPath,
                  folderName: 'Appendices',
                  partNum: '',
                  title: 'Appendices',
                  chapters: book().appendices
                }}
                isAppendix={true}
              />
            </Show>
          </div>
        )}
      </Show>

      <Show when={!loading() && !structure() && !error()}>
        <div class="empty-state">
          <p>Enter a book folder path above to get started</p>
        </div>
      </Show>
    </div>
  );
};
