import { Component, For } from 'solid-js';
import type { Chapter } from '../types';
import { SectionNode } from './SectionNode';

interface ChapterNodeProps {
  chapter: Chapter;
  onFileSelect: (filePath: string | null) => void;
}

export const ChapterNode: Component<ChapterNodeProps> = (props) => {
  // Chapter's first section is the S1 heading
  const chapterSection = () => props.chapter.sections[0];

  return (
    <div class="chapter-node">
      <div 
        class="chapter-header clickable"
        onClick={() => props.onFileSelect(chapterSection()?.filePath ?? null)}
      >
        <span class="chapter-title">Chapter</span>
      </div>
      
      {/* All sections in this chapter */}
      <div class="chapter-sections">
        <For each={props.chapter.sections}>
          {(section) => (
            <SectionNode 
              section={section} 
              allSections={props.chapter.sections}
              onFileSelect={props.onFileSelect} 
            />
          )}
        </For>
      </div>
    </div>
  );
};
