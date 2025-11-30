import { Component, onMount, onCleanup } from 'solid-js';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const ContextMenu: Component<ContextMenuProps> = (props) => {
  let menuRef: HTMLDivElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div
      ref={menuRef}
      class="context-menu"
      style={{ top: `${props.y}px`, left: `${props.x}px` }}
    >
      <div
        class={`context-menu-item ${!props.canMoveUp ? 'disabled' : ''}`}
        onClick={() => {
          if (props.canMoveUp) {
            props.onMoveUp();
            props.onClose();
          }
        }}
      >
        Move Up
      </div>
      <div
        class={`context-menu-item ${!props.canMoveDown ? 'disabled' : ''}`}
        onClick={() => {
          if (props.canMoveDown) {
            props.onMoveDown();
            props.onClose();
          }
        }}
      >
        Move Down
      </div>
    </div>
  );
};
