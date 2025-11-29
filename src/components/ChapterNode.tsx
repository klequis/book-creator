import { Component, createSignal, For, Show } from 'solid-js';
import type { ChapterMetadata } from '../types/book';
import { FileNode } from './FileNode';
import './TreeView.css';

interface ChapterNodeProps {
  chapter: ChapterMetadata;
}

export const ChapterNode: Component<ChapterNodeProps> = (props) => {
  const [expanded, setExpanded] = createSignal(true);

  const toggleExpand = () => {
    setExpanded(!expanded());
  };

  const getDisplayTitle = () => {
    const num = props.chapter.chapterNum;
    const title = props.chapter.title;
    // Handle numeric chapters and appendix chapters (A, B, C)
    if (num.match(/^\d+$/)) {
      return `${parseInt(num)}. ${title}`;
    }
    return `${num}. ${title}`;
  };

  return (
    <div class="chapter-node">
      <div class="chapter-header" onClick={toggleExpand}>
        <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
        <span class="chapter-title">{getDisplayTitle()}</span>
        <span class="file-count">({props.chapter.files.length})</span>
      </div>

      <Show when={expanded()}>
        <div class="files-container">
          <For each={props.chapter.files}>
            {(file) => <FileNode file={file} />}
          </For>
        </div>
      </Show>
    </div>
  );
};
