import { Component, createSignal, Show } from 'solid-js';
import type { Section } from '../types/book';
import { ContextMenu } from './ContextMenu';
import './TreeView.css';

interface SectionMetadata {
  isFirst: boolean;
  isLast: boolean;
  isChapterTitle: boolean;
}

interface SectionNodeProps {
  section: Section;
  metadata: SectionMetadata;
  onFileSelect: (filePath: string | null) => void;
  onMove?: (direction: 'up' | 'down') => void;
  onAddSection?: (position: 'above' | 'below') => void;
}

export const SectionNode: Component<SectionNodeProps> = (props) => {
  const [showContextMenu, setShowContextMenu] = createSignal(false);
  const [menuPosition, setMenuPosition] = createSignal({ x: 0, y: 0 });

  const handleClick = () => {
    props.onFileSelect(props.section.filePath);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const getLevelClass = () => {
    return `file-node file-level-${props.section.level}`;
  };

  return (
    <>
      <div 
        class={getLevelClass()} 
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span class="file-icon">📄</span>
        <span class="file-label">{props.section.displayLabel}</span>
      </div>
      
      <Show when={showContextMenu()}>
        <ContextMenu
          x={menuPosition().x}
          y={menuPosition().y}
          onClose={() => setShowContextMenu(false)}
          items={[
            props.onAddSection && {
              label: 'Add Section Above',
              onClick: () => {
                props.onAddSection?.('above');
                setShowContextMenu(false);
              }
            },
            props.onAddSection && {
              label: 'Add Section Below',
              onClick: () => {
                props.onAddSection?.('below');
                setShowContextMenu(false);
              }
            },
            props.onMove && !props.metadata.isFirst && {
              label: 'Move Up',
              onClick: () => {
                props.onMove?.('up');
                setShowContextMenu(false);
              }
            },
            props.onMove && !props.metadata.isLast && {
              label: 'Move Down',
              onClick: () => {
                props.onMove?.('down');
                setShowContextMenu(false);
              }
            }
          ].filter(Boolean) as Array<{label: string; onClick: () => void; disabled?: boolean}>}
        />
      </Show>
    </>
  );
};
