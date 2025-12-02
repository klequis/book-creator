import { Component, createSignal, Show } from 'solid-js';
import type { Section } from '../types/book';
import { ContextMenu } from './ContextMenu';
import { InlineInput } from './InlineInput';
import { bookStoreActions } from '../stores/bookStore';
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
  const [isRenaming, setIsRenaming] = createSignal(false);

  const handleClick = () => {
    props.onFileSelect(props.section.filePath);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleRename = async (newTitle: string) => {
    setIsRenaming(false);
    if (newTitle && newTitle.trim() !== props.section.title) {
      await bookStoreActions.renameSection(props.section.id, newTitle.trim());
    }
  };

  const handlePromote = async () => {
    setShowContextMenu(false);
    await bookStoreActions.promoteSection(props.section.id);
  };

  const handleDemote = async () => {
    setShowContextMenu(false);
    await bookStoreActions.demoteSection(props.section.id);
  };

  const canPromote = () => {
    // Only levels 2-3 can be promoted
    return props.section.level >= 2 && props.section.level <= 3;
  };

  const canDemote = () => {
    // Only levels 1-2 can be demoted
    return props.section.level >= 1 && props.section.level <= 2;
  };

  const getLevelClass = () => {
    return `file-node file-level-${props.section.level}`;
  };

  return (
    <>
      <Show 
        when={!isRenaming()}
        fallback={
          <div class={getLevelClass()}>
            <span class="file-icon">📄</span>
            <InlineInput
              initialValue={props.section.title}
              placeholder="Section name..."
              onSave={handleRename}
              onCancel={() => setIsRenaming(false)}
            />
          </div>
        }
      >
        <div 
          class={getLevelClass()} 
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          <span class="file-icon">📄</span>
          <span class="file-label">{props.section.displayLabel}</span>
        </div>
      </Show>
      
      <Show when={showContextMenu()}>
        <ContextMenu
          x={menuPosition().x}
          y={menuPosition().y}
          onClose={() => setShowContextMenu(false)}
          items={[
            {
              label: 'Rename',
              onClick: () => {
                setShowContextMenu(false);
                setIsRenaming(true);
              }
            },
            {
              label: 'Promote Level ↑',
              onClick: handlePromote,
              disabled: !canPromote()
            },
            {
              label: 'Demote Level ↓',
              onClick: handleDemote,
              disabled: !canDemote()
            },
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
