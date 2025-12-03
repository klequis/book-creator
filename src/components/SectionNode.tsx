import { Component, For, Show } from 'solid-js';
import type { Section } from '../types';

interface SectionNodeProps {
  section: Section;
  allSections: Section[]; // All sections in parent container for finding children
  onFileSelect: (filePath: string | null) => void;
}

export const SectionNode: Component<SectionNodeProps> = (props) => {
  // Find direct children of this section
  const children = () => 
    props.allSections.filter(s => s.parentId === props.section.id);

  // Indentation based on level
  const indent = () => `${(props.section.level - 1) * 20}px`;

  return (
    <div class="section-node" style={{ 'margin-left': indent() }}>
      <div 
        class="section-header clickable"
        onClick={() => props.onFileSelect(props.section.filePath)}
      >
        <span class="section-level">S{props.section.level}</span>
        <span class="section-order">({props.section.order})</span>
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
