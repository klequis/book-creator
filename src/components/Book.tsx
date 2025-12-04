import { Component, For, Show } from 'solid-js';
import { ChapterNode } from './ChapterNode';
import { useBook } from '~/contexts/BookContext';

export const Book: Component = () => {
  const [bookState] = useBook();

  return (
    <div>
      {/* TODO: Introduction when we have it */}
      {/* TODO: Parts when we have them */}

      {/* Chapters */}
      <Show when={bookState.book.chapters.length > 0}>
        <For each={bookState.book.chapters}>
          {(chapter) => (
            <ChapterNode chapter={chapter} />
          )}
        </For>
      </Show>

      {/* TODO: Appendices when we have them */}
    </div>
  );
};
