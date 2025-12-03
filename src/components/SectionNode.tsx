import { Component, For, Show } from 'solid-js';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, File } from 'lucide-solid';
import type { Section } from '../types';
import { useBookContext } from '../contexts/BookContext';
import { bookStoreActions } from '../stores/bookStore';
import { orderPlus, orderMinus, levelPlus, levelMinus } from '../movement-operations';
import { showError, showSuccess } from '../utils/notifications';
import './CollapsibleContainer.css';

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

  // Movement operation handlers
  const handleOrderPlus = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const updates = orderPlus(props.section.id, props.allSections);
      bookStoreActions.applySectionUpdates(updates);
      showSuccess('Moved section up');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to move section');
    }
  };

  const handleOrderMinus = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const updates = orderMinus(props.section.id, props.allSections);
      bookStoreActions.applySectionUpdates(updates);
      showSuccess('Moved section down');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to move section');
    }
  };

  const handleLevelPlus = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const updates = levelPlus(props.section.id, props.allSections);
      bookStoreActions.applySectionUpdates(updates);
      showSuccess('Promoted section');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to promote section');
    }
  };

  const handleLevelMinus = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const updates = levelMinus(props.section.id, props.allSections);
      bookStoreActions.applySectionUpdates(updates);
      showSuccess('Demoted section');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to demote section');
    }
  };

  // Check if operations are disabled (S1 cannot move)
  const isS1 = () => props.section.level === 1;

  return (
    <div class="section-node">
      <div 
        class="section-header"
        onClick={() => props.onFileSelect(fullPath())}
      >
        <File size={14} />
        <span class="section-level">S{props.section.level}</span>
        <span class="section-order">({props.section.order})</span>
        <span class="section-name">{fileName()}</span>
        
        {/* Movement controls */}
        <div class="section-controls" onClick={(e) => e.stopPropagation()}>
          <button 
            class="control-btn" 
            onClick={handleOrderPlus}
            disabled={isS1()}
            title="Move up (Order+)"
          >
            <ChevronUp size={12} />
          </button>
          <button 
            class="control-btn" 
            onClick={handleOrderMinus}
            disabled={isS1()}
            title="Move down (Order-)"
          >
            <ChevronDown size={12} />
          </button>
          <button 
            class="control-btn" 
            onClick={handleLevelPlus}
            disabled={isS1()}
            title="Promote (Level+)"
          >
            <ChevronLeft size={12} />
          </button>
          <button 
            class="control-btn" 
            onClick={handleLevelMinus}
            disabled={isS1()}
            title="Demote (Level-)"
          >
            <ChevronRight size={12} />
          </button>
        </div>
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
