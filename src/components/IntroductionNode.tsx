import { Component, For } from 'solid-js';
import { BookOpen } from 'lucide-solid';
import type { Introduction } from '../types';
import { SectionNode } from './SectionNode';
import { CollapsibleContainer } from './CollapsibleContainer';
import './CollapsibleContainer.css';

interface IntroductionNodeProps {
  introduction: Introduction;
  onFileSelect: (filePath: string | null) => void;
}

export const IntroductionNode: Component<IntroductionNodeProps> = (props) => {
  return (
    <CollapsibleContainer
      icon={<BookOpen size={16} />}
      label="Introduction"
      defaultExpanded={true}
    >
      <For each={props.introduction.sections}>
        {(section) => (
          <SectionNode 
            section={section} 
            allSections={props.introduction.sections}
            onFileSelect={props.onFileSelect} 
          />
        )}
      </For>
    </CollapsibleContainer>
  );
};
