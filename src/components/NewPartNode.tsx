import { Component, For } from 'solid-js';
import type { Part } from '../types';
import { ChapterNode } from './ChapterNode';

interface PartNodeProps {
  part: Part;
  onFileSelect: (filePath: string | null) => void;
}

export const PartNode: Component<PartNodeProps> = (props) => {
  // Part's sections are just the S1 heading section(s)
  const partSection = () => props.part.sections[0]; // Parts must have exactly one S1

  return (
    <div class="part-node">
      <div 
        class="part-header clickable"
        onClick={() => props.onFileSelect(partSection()?.filePath ?? null)}
      >
        <span class="part-title">Part</span>
      </div>
      
      {/* Chapters within this part */}
      <div class="part-chapters">
        <For each={props.part.chapters}>
          {(chapter) => (
            <ChapterNode 
              chapter={chapter} 
              onFileSelect={props.onFileSelect} 
            />
          )}
        </For>
      </div>
    </div>
  );
};
