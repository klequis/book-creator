import { Component } from 'solid-js';
import type { Section } from '../types/book';
import './TreeView.css';

interface FileNodeProps {
  file: Section;
  onFileSelect: (filePath: string | null) => void;
}

export const FileNode: Component<FileNodeProps> = (props) => {
  const handleClick = () => {
    props.onFileSelect(props.file.filePath);
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
