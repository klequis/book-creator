import { Component, For } from 'solid-js';
import { FileText } from 'lucide-solid';
import type { Appendix } from '../types';
import { SectionNode } from './SectionNode';
import { CollapsibleContainer } from './CollapsibleContainer';
import './CollapsibleContainer.css';

interface AppendixNodeProps {
  appendix: Appendix;
  onFileSelect: (filePath: string | null) => void;
}

export const AppendixNode: Component<AppendixNodeProps> = (props) => {
  const appendixTitle = () => {
    const firstSection = props.appendix.sections[0];
    if (firstSection) {
      const parts = firstSection.filePath.split('/');
      return parts[parts.length - 1].replace('.md', '');
    }
    return 'Appendix';
  };

  return (
    <CollapsibleContainer
      icon={<FileText size={16} />}
      label={appendixTitle()}
      defaultExpanded={true}
    >
      <For each={props.appendix.sections}>
        {(section) => (
          <SectionNode 
            section={section} 
            allSections={props.appendix.sections}
            onFileSelect={props.onFileSelect} 
          />
        )}
      </For>
    </CollapsibleContainer>
  );
};
