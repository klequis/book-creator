import { Component, createSignal, For, Show } from 'solid-js';
import type { PartMetadata } from '../types/book';
import { ChapterNode } from './ChapterNode';
import './TreeView.css';

interface PartNodeProps {
  part: PartMetadata;
  isIntroduction?: boolean;
  isAppendix?: boolean;
}

export const PartNode: Component<PartNodeProps> = (props) => {
  const [expanded, setExpanded] = createSignal(true);

  const toggleExpand = () => {
    setExpanded(!expanded());
  };

  const getDisplayTitle = () => {
    if (props.isIntroduction) return 'Introduction';
    if (props.isAppendix) return 'Appendices';
    if (props.part.partNum && props.part.title) {
      return `Part ${parseInt(props.part.partNum)}. ${props.part.title}`;
    }
    return '';
  };

  const shouldShowPartHeader = () => {
    return props.isIntroduction || props.isAppendix || props.part.partNum;
  };

  return (
    <div class="part-node">
      <Show when={shouldShowPartHeader()}>
        <div class="part-header" onClick={toggleExpand}>
          <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
          <span class="part-title">{getDisplayTitle()}</span>
        </div>
      </Show>

      <Show when={expanded()}>
        <div class="chapters-container">
          <For each={props.part.chapters}>
            {(chapter) => <ChapterNode chapter={chapter} />}
          </For>
        </div>
      </Show>
    </div>
  );
};
