import { Component, createSignal, For, Show } from 'solid-js';
import type { Chapter, Section } from '../types/book';
import { FileNode } from './FileNode';
import { ContextMenu } from './ContextMenu';
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
  const [contextMenu, setContextMenu] = createSignal<{ x: number; y: number } | null>(null);

  const toggleExpand = () => {
    setExpanded(!expanded());
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleAddSection = async () => {
    setContextMenu(null);
    await addSection();
  };

  const addSection = async () => {
    try {
      // Find the next available section number
      const existingSections = props.sections.filter(s => s.level === 1); // H2 sections
      let nextNum = 1;
      if (existingSections.length > 0) {
        const nums = existingSections.map(s => parseInt(s.section2Num));
        nextNum = Math.max(...nums) + 1;
      }

      const section2Num = nextNum.toString().padStart(2, '0');
      const fileName = `${props.chapter.chapterNum}-${section2Num}-00-00 New Section.md`;
      const filePath = `${props.chapter.folderPath}/${fileName}`;

      // Create the file with default content
      const content = `## ${props.chapter.chapterNum}.${nextNum} New Section\n\nSection content goes here.\n`;
      
      await invoke('write_file', {
        path: filePath,
        contents: content
      });

      console.log('Created new section:', filePath);

      // Trigger refresh
      props.onSectionsReordered?.();
    } catch (error) {
      console.error('Failed to add section:', error);
      alert(`Failed to add section: ${error}`);
    }
  };

  const addSectionRelativeTo = async (index: number, position: 'above' | 'below') => {
    try {
      const targetSection = props.sections[index];
      const targetNum = parseInt(targetSection.section2Num);
      const insertNum = position === 'above' ? targetNum : targetNum + 1;

      // Renumber all sections at or after the insert position
      const sectionsToRenumber = props.sections
        .filter(s => s.level === 1 && parseInt(s.section2Num) >= insertNum)
        .sort((a, b) => parseInt(b.section2Num) - parseInt(a.section2Num)); // Descending order

      for (const section of sectionsToRenumber) {
        const oldNum = parseInt(section.section2Num);
        const newNum = oldNum + 1;
        const newSection2Num = newNum.toString().padStart(2, '0');
        
        const newFileName = section.fileName.replace(
          /^(\d+|[A-Z])-(\d+)-/,
          `$1-${newSection2Num}-`
        );
        const newPath = `${props.chapter.folderPath}/${newFileName}`;

        await invoke('rename_path', {
          oldPath: section.filePath,
          newPath
        });
      }

      // Create the new section
      const section2Num = insertNum.toString().padStart(2, '0');
      const fileName = `${props.chapter.chapterNum}-${section2Num}-00-00 New Section.md`;
      const filePath = `${props.chapter.folderPath}/${fileName}`;

      const content = `## ${props.chapter.chapterNum}.${insertNum} New Section\n\nSection content goes here.\n`;
      
      await invoke('write_file', {
        path: filePath,
        contents: content
      });

      console.log('Created new section:', filePath);

      // Trigger refresh
      props.onSectionsReordered?.();
    } catch (error) {
      console.error('Failed to add section:', error);
      alert(`Failed to add section: ${error}`);
    }
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
      <div class="chapter-header" onClick={toggleExpand} onContextMenu={handleContextMenu}>
        <span class="expand-icon">{expanded() ? '▼' : '▶'}</span>
        <span class="chapter-title">{getDisplayTitle()}</span>
        <span class="file-count">({props.sections.length})</span>
      </div>

      <Show when={contextMenu()}>
        <ContextMenu
          x={contextMenu()!.x}
          y={contextMenu()!.y}
          onClose={() => setContextMenu(null)}
          items={[
            { label: 'Add Section', onClick: handleAddSection }
          ]}
        />
      </Show>

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
                onAddSectionAbove={() => addSectionRelativeTo(index(), 'above')}
                onAddSectionBelow={() => addSectionRelativeTo(index(), 'below')}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
