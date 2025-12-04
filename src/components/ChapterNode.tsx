import { Component, For } from 'solid-js';
import { FileText } from 'lucide-solid';
import type { Chapter } from '~/types';
import { SectionNode } from './SectionNode';
import { CollapsibleContainer } from './CollapsibleContainer';
import './CollapsibleContainer.css';

interface ChapterNodeProps {
  chapter: Chapter;
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}

export const ChapterNode: Component<ChapterNodeProps> = (props) => {
  const chapterTitle = () => {
    // Get the first section's filename as the chapter title
    const firstSection = props.chapter.sections[0];
    if (firstSection) {
      const parts = firstSection.filePath.split('/');
      return parts[parts.length - 1].replace('.md', '');
    }
    return 'Chapter';
  };

  return (
    <CollapsibleContainer
      icon={<FileText size={16} />}
      label={chapterTitle()}
      defaultExpanded={true}
    >
      <For each={props.chapter.sections}>
        {(section) => (
          <SectionNode 
            section={section} 
            allSections={props.chapter.sections}
            onFileSelect={props.onFileSelect}
            rootPath={props.rootPath}
          />
        )}
      </For>
    </CollapsibleContainer>
  );
};
