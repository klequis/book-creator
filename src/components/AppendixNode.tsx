import { Component, For } from 'solid-js';
import type { Appendix } from '../types';
import { SectionNode } from './SectionNode';

interface AppendixNodeProps {
  appendix: Appendix;
  onFileSelect: (filePath: string | null) => void;
}

export const AppendixNode: Component<AppendixNodeProps> = (props) => {
  const appendixSection = () => props.appendix.sections[0];

  return (
    <div class="appendix-node">
      <div 
        class="appendix-header clickable"
        onClick={() => props.onFileSelect(appendixSection()?.filePath ?? null)}
      >
        <span class="appendix-title">Appendix</span>
      </div>
      
      <div class="appendix-sections">
        <For each={props.appendix.sections}>
          {(section) => (
            <SectionNode 
              section={section} 
              allSections={props.appendix.sections}
              onFileSelect={props.onFileSelect} 
            />
          )}
        </For>
      </div>
    </div>
  );
};
