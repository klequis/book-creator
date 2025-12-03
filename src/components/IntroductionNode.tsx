import { Component, For } from 'solid-js';
import type { Introduction } from '../types';
import { SectionNode } from './SectionNode';

interface IntroductionNodeProps {
  introduction: Introduction;
  onFileSelect: (filePath: string | null) => void;
}

export const IntroductionNode: Component<IntroductionNodeProps> = (props) => {
  return (
    <div class="introduction-node">
      <div class="container-label">Introduction</div>
      <For each={props.introduction.sections}>
        {(section) => (
          <SectionNode 
            section={section} 
            allSections={props.introduction.sections}
            onFileSelect={props.onFileSelect} 
          />
        )}
      </For>
    </div>
  );
};
