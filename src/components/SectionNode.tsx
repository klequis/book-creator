import { Component, For, Show } from 'solid-js';
import type { Section } from '../types';
import { useBookContext } from '../contexts/BookContext';

interface SectionNodeProps {
  section: Section;
  allSections: Section[]; // All sections in parent container for finding children
  onFileSelect: (filePath: string | null) => void;
}

export const SectionNode: Component<SectionNodeProps> = (props) => {
  const { rootPath } = useBookContext();
  
  // Find direct children of this section
  const children = () => 
    props.allSections.filter(s => s.parentId === props.section.id);

  // Indentation based on level
  const indent = () => `${(props.section.level - 1) * 20}px`;
  
  // Extract filename from path for display
  const fileName = () => {
    const parts = props.section.filePath.split('/');
    return parts[parts.length - 1].replace('.md', '');
  };
  
  // Construct full absolute path
  const fullPath = () => {
    const root = rootPath();
    return root ? `${root}/${props.section.filePath}` : props.section.filePath;
  };

  return (
    <div class="section-node" style={{ 'margin-left': indent() }}>
      <div 
        class="section-header clickable"
        onClick={() => props.onFileSelect(fullPath())}
      >
        <span class="section-level">S{props.section.level}</span>
        <span class="section-order">({props.section.order})</span>
        <span class="section-name">{fileName()}</span>
      </div>

      {/* Render children recursively */}
      <Show when={children().length > 0}>
        <div class="section-children">
          <For each={children()}>
            {(child) => (
              <SectionNode 
                section={child} 
                allSections={props.allSections}
                onFileSelect={props.onFileSelect} 
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
