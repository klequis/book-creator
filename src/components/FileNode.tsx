import { Component, createSignal, Show } from 'solid-js';
import type { Section } from '../types/book';
import { ContextMenu } from './ContextMenu';
import './TreeView.css';

interface FileNodeProps {
  file: Section;
  onFileSelect: (filePath: string | null) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const FileNode: Component<FileNodeProps> = (props) => {
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
          onMoveUp={() => props.onMoveUp?.()}
          onMoveDown={() => props.onMoveDown?.()}
          canMoveUp={props.canMoveUp ?? false}
          canMoveDown={props.canMoveDown ?? false}
        />
      </Show>
    </>
  );
};
