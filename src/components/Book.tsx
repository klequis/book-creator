import { Component, For, Show } from 'solid-js';
import type { Book } from '../types';
import { IntroductionNode } from './IntroductionNode';
import { PartNode } from './PartNode';
import { ChapterNode } from './ChapterNode';
import { AppendixNode } from './AppendixNode';

interface BookProps {
  book: Book;
  onFileSelect: (filePath: string | null) => void;
}

export const Book: Component<BookProps> = (props) => {
  return (
    <div class="tree-content">
      {/* Introduction */}
      <Show when={props.book.introduction}>
        {(intro) => (
          <IntroductionNode 
            introduction={intro()} 
            onFileSelect={props.onFileSelect} 
          />
        )}
      </Show>

      {/* Parts with their chapters */}
      <Show when={props.book.parts && props.book.parts.length > 0}>
        <For each={props.book.parts}>
          {(part) => (
            <PartNode 
              part={part} 
              onFileSelect={props.onFileSelect} 
            />
          )}
        </For>
      </Show>

      {/* Standalone chapters (no parts) */}
      <Show when={props.book.chapters.length > 0}>
        <For each={props.book.chapters}>
          {(chapter) => (
            <ChapterNode 
              chapter={chapter} 
              onFileSelect={props.onFileSelect} 
            />
          )}
        </For>
      </Show>

      {/* Appendices */}
      <Show when={props.book.appendices.length > 0}>
        <div class="appendices-section">
          <For each={props.book.appendices}>
            {(appendix) => (
              <AppendixNode 
                appendix={appendix} 
                onFileSelect={props.onFileSelect} 
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
