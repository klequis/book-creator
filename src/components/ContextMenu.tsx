import { Component, onMount, onCleanup, For } from 'solid-js';
import './ContextMenu.css';

interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items?: MenuItem[];
  // Legacy props for backwards compatibility
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
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

  // Use items if provided, otherwise fall back to legacy move up/down
  const menuItems = props.items || [
    {
      label: 'Move Up',
      onClick: () => {
        if (props.onMoveUp) props.onMoveUp();
        props.onClose();
      },
      disabled: !props.canMoveUp
    },
    {
      label: 'Move Down',
      onClick: () => {
        if (props.onMoveDown) props.onMoveDown();
        props.onClose();
      },
      disabled: !props.canMoveDown
    }
  ];

  return (
    <div
      ref={menuRef}
      class="context-menu"
      style={{ top: `${props.y}px`, left: `${props.x}px` }}
    >
      <For each={menuItems}>
        {(item) => (
          <div
            class={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                if (!props.items) {
                  // Only auto-close for legacy mode
                  props.onClose();
                }
              }
            }}
          >
            {item.label}
          </div>
        )}
      </For>
    </div>
  );
};
