import { Component, For, Show } from 'solid-js';
import type { Book } from '~/types';
import { ChapterNode } from './ChapterNode';

interface BookProps {
  book: Book;
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}

export const Book: Component<BookProps> = (props) => {
  return (
    <div>
      {/* TODO: Introduction when we have it */}
      {/* TODO: Parts when we have them */}

      {/* Chapters */}
      <Show when={props.book.chapters.length > 0}>
        <For each={props.book.chapters}>
          {(chapter) => (
            <ChapterNode 
              chapter={chapter} 
              onFileSelect={props.onFileSelect}
              rootPath={props.rootPath}
            />
          )}
        </For>
      </Show>

      {/* TODO: Appendices when we have them */}
    </div>
  );
};
