import { Component, For } from 'solid-js';
import { FolderOpen } from 'lucide-solid';
import type { Part } from '../types';
import { ChapterNode } from './ChapterNode';
import { CollapsibleContainer } from './CollapsibleContainer';
import './CollapsibleContainer.css';

interface PartNodeProps {
  part: Part;
  onFileSelect: (filePath: string | null) => void;
}

export const PartNode: Component<PartNodeProps> = (props) => {
  const partTitle = () => {
    // Get the part's S1 section filename as title
    const partSection = props.part.sections[0];
    if (partSection) {
      const parts = partSection.filePath.split('/');
      return parts[parts.length - 1].replace('.md', '');
    }
    return 'Part';
  };

  return (
    <CollapsibleContainer
      icon={<FolderOpen size={16} />}
      label={partTitle()}
      defaultExpanded={true}
    >
      <For each={props.part.chapters}>
        {(chapter) => (
          <ChapterNode 
            chapter={chapter} 
            onFileSelect={props.onFileSelect} 
          />
        )}
      </For>
    </CollapsibleContainer>
  );
};
