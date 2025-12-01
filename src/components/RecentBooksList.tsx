import { Component, createSignal, onMount, Show, For } from 'solid-js';
import { getRecentBooks, type RecentBook } from '../utils/recentBooks';
import './RecentBooksList.css';

interface RecentBooksListProps {
  onSelectBook: (path: string) => void;
}

export const RecentBooksList: Component<RecentBooksListProps> = (props) => {
  const [recentBooks, setRecentBooks] = createSignal<RecentBook[]>([]);
  const [expanded, setExpanded] = createSignal(false);

  onMount(async () => {
    const books = await getRecentBooks();
    setRecentBooks(books);
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getBookName = (path: string) => {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded());
  };

  return (
    <div class="recent-books">
      <div class="recent-books-header" onClick={toggleExpanded}>
        <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
        <span class="recent-books-title">Recent Books</span>
        <span class="recent-books-count">({recentBooks().length})</span>
      </div>
      
      <Show when={expanded()}>
        <div class="recent-books-list">
          <Show 
            when={recentBooks().length > 0}
            fallback={<div class="recent-books-empty">No recent books</div>}
          >
            <For each={recentBooks()}>
              {(book) => (
                <div 
                  class="recent-book-item"
                  onClick={() => props.onSelectBook(book.path)}
                  title={book.path}
                >
                  <div class="recent-book-name">{getBookName(book.path)}</div>
                  <div class="recent-book-date">{formatDate(book.lastOpened)}</div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
};
