import { Component, createSignal, For, Show } from 'solid-js';
import type { BookPart, Chapter, Section } from '../types/book';
import { ChapterNode } from './ChapterNode';
import './TreeView.css';

interface PartNodeProps {
  part: BookPart;
  chapters: Chapter[];
  sections: Section[];
  isIntroduction?: boolean;
  isAppendix?: boolean;
  onFileSelect: (filePath: string | null) => void;
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

  // Helper to get sections for a specific chapter
  const getSectionsForChapter = (chapterId: string) => {
    return props.sections.filter(sec => sec.chapterId === chapterId);
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
          <For each={props.chapters}>
            {(chapter) => {
              const chapterSections = getSectionsForChapter(chapter.id);
              return <ChapterNode chapter={chapter} sections={chapterSections} onFileSelect={props.onFileSelect} />;
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
