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
    props.onFileSelect(props.file.filePath);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const getLevelClass = () => {
    return `file-node file-level-${props.file.level}`;
  };

  return (
    <>
      <div 
        class={getLevelClass()} 
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span class="file-icon">📄</span>
        <span class="file-label">{props.file.displayLabel}</span>
      </div>
      
      <Show when={showContextMenu()}>
        <ContextMenu
          x={menuPosition().x}
          y={menuPosition().y}
          onClose={() => setShowContextMenu(false)}
          items={[
            props.onAddSectionAbove && {
              label: 'Add Section Above',
              onClick: () => {
                props.onAddSectionAbove?.();
                setShowContextMenu(false);
              }
            },
            props.onAddSectionBelow && {
              label: 'Add Section Below',
              onClick: () => {
                props.onAddSectionBelow?.();
                setShowContextMenu(false);
              }
            },
            props.onMoveUp && {
              label: 'Move Up',
              onClick: () => {
                props.onMoveUp?.();
                setShowContextMenu(false);
              },
              disabled: !props.canMoveUp
            },
            props.onMoveDown && {
              label: 'Move Down',
              onClick: () => {
                props.onMoveDown?.();
                setShowContextMenu(false);
              },
              disabled: !props.canMoveDown
            }
          ].filter(Boolean) as Array<{label: string; onClick: () => void; disabled?: boolean}>}
        />
      </Show>
    </>
  );
};
