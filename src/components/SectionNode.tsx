import { Component, For, Show } from 'solid-js';
import { File } from 'lucide-solid';
import type { Section } from '~/types';

interface SectionNodeProps {
  section: Section;
  allSections: Section[];
  onFileSelect: (filePath: string) => void;
  rootPath: string;
}

export const SectionNode: Component<SectionNodeProps> = (props) => {
  // Find direct children of this section
  const children = () => 
    props.allSections.filter(s => s.parentId === props.section.id);
  
  // Extract filename from path for display
  const fileName = () => {
    const parts = props.section.filePath.split('/');
    return parts[parts.length - 1].replace('.md', '');
  };
  
  // Construct full path relative to book root
  const fullPath = () => `${props.rootPath}/${props.section.filePath}`;

  return (
    <div>
      <div 
        style={{ 
          cursor: "pointer", 
          padding: "5px", 
          display: "flex", 
          "align-items": "center", 
          gap: "5px" 
        }}
        onClick={() => props.onFileSelect(fullPath())}
      >
        <File size={14} />
        <span>S{props.section.level}</span>
        <span>({props.section.order})</span>
        <span>{fileName()}</span>
      </div>

      <Show when={children().length > 0}>
        <div style={{ "padding-left": "20px" }}>
          <For each={children()}>
            {(child) => (
              <SectionNode 
                section={child} 
                allSections={props.allSections}
                onFileSelect={props.onFileSelect}
                rootPath={props.rootPath}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
