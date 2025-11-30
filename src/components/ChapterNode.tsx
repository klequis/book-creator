import { Component, createSignal, For, Show } from 'solid-js';
import type { Chapter, Section } from '../types/book';
import { FileNode } from './FileNode';
import { invoke } from '@tauri-apps/api/core';
import './TreeView.css';

interface ChapterNodeProps {
  chapter: Chapter;
  sections: Section[];
  onFileSelect: (filePath: string | null) => void;
  onSectionsReordered?: () => void;
}

export const ChapterNode: Component<ChapterNodeProps> = (props) => {
  const [expanded, setExpanded] = createSignal(true);

  const toggleExpand = () => {
    setExpanded(!expanded());
  };

  const getDisplayTitle = () => {
    const num = props.chapter.chapterNum;
    const title = props.chapter.title;
    // Handle numeric chapters and appendix chapters (A, B, C)
    if (num.match(/^\d+$/)) {
      return `${parseInt(num)}. ${title}`;
    }
    return `${num}. ${title}`;
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === props.sections.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const section1 = props.sections[index];
    const section2 = props.sections[newIndex];

    console.log('Moving section:', { section1, section2, direction });

    try {
      // Generate new filenames with swapped positions
      const getNewFileName = (section: Section, newNumbers: { s2: string, s3: string, s4: string }) => {
        const { chapterNum, title } = section;
        return `${chapterNum}-${newNumbers.s2}-${newNumbers.s3}-${newNumbers.s4} ${title}.md`;
      };

      const section1Numbers = { s2: section1.section2Num, s3: section1.section3Num, s4: section1.section4Num };
      const section2Numbers = { s2: section2.section2Num, s3: section2.section3Num, s4: section2.section4Num };

      const newFileName1 = getNewFileName(section1, section2Numbers);
      const newFileName2 = getNewFileName(section2, section1Numbers);

      const newPath1 = `${props.chapter.folderPath}/${newFileName1}`;
      const newPath2 = `${props.chapter.folderPath}/${newFileName2}`;

      console.log('Renaming files:', {
        from1: section1.filePath, to1: newPath1,
        from2: section2.filePath, to2: newPath2
      });

      // Use temp file to avoid conflicts
      const tempPath = `${props.chapter.folderPath}/.temp-swap-${Date.now()}.md`;
      
      await invoke('rename_path', { 
        oldPath: section1.filePath, 
        newPath: tempPath 
      });
      
      await invoke('rename_path', { 
        oldPath: section2.filePath, 
        newPath: newPath1 
      });
      
      await invoke('rename_path', { 
        oldPath: tempPath, 
        newPath: newPath2 
      });

      console.log('Files renamed successfully');

      // Trigger refresh
      props.onSectionsReordered?.();
    } catch (error) {
      console.error('Failed to move section:', error);
      alert(`Failed to move section: ${error}`);
    }
  };

  return (
    <div class="chapter-node">
      <div class="chapter-header" onClick={toggleExpand}>
        <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
        <span class="chapter-title">{getDisplayTitle()}</span>
        <span class="file-count">({props.sections.length})</span>
      </div>

      <Show when={expanded()}>
        <div class="files-container">
          <For each={props.sections}>
            {(file, index) => (
              <FileNode 
                file={file} 
                onFileSelect={props.onFileSelect}
                onMoveUp={() => moveSection(index(), 'up')}
                onMoveDown={() => moveSection(index(), 'down')}
                canMoveUp={index() > 0}
                canMoveDown={index() < props.sections.length - 1}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
