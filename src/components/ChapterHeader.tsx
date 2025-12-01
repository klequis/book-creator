import { Component, createSignal } from 'solid-js';
import type { Chapter } from '../types/book';
import './TreeView.css';

interface ChapterHeaderProps {
  chapter: Chapter;
  sectionCount: number;
  onContextMenu: (e: MouseEvent) => void;
  children?: any;
}

export const ChapterHeader: Component<ChapterHeaderProps> = (props) => {
  const [expanded, setExpanded] = createSignal(true);

  const toggleExpand = () => {
    setExpanded(!expanded());
  };

  const getDisplayTitle = () => {
    const num = props.chapter.chapterNum;
    const title = props.chapter.title;
    if (num.match(/^\d+$/)) {
      return `${parseInt(num)}. ${title}`;
    }
    return `${num}. ${title}`;
  };

  return (
    <>
      <div class="chapter-header" onClick={toggleExpand} onContextMenu={props.onContextMenu}>
        <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
        <span class="chapter-title">{getDisplayTitle()}</span>
        <span class="file-count">({props.sectionCount})</span>
      </div>
      {expanded() && props.children}
    </>
  );
};
