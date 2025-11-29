import { Component } from 'solid-js';
import type { SectionMetadata } from '../types/book';
import './TreeView.css';

interface FileNodeProps {
  file: SectionMetadata;
}

export const FileNode: Component<FileNodeProps> = (props) => {
  const handleClick = () => {
    console.log('File clicked:', props.file.filePath);
    // TODO: Open file in editor or external app
  };

  const getLevelClass = () => {
    return `file-node file-level-${props.file.level}`;
  };

  return (
    <div class={getLevelClass()} onClick={handleClick}>
      <span class="file-icon">📄</span>
      <span class="file-label">{props.file.displayLabel}</span>
    </div>
  );
};
