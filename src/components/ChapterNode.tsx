import { Component, createSignal, For, Show } from 'solid-js';
import type { Chapter, Section } from '../types/book';
import { SectionNode } from './SectionNode';
import { ContextMenu } from './ContextMenu';
import { InlineInput } from './InlineInput';
import { ChapterHeader } from './ChapterHeader';
import { invoke } from '@tauri-apps/api/core';
import { bookStoreActions } from '../stores/bookStore';
import './TreeView.css';

interface ChapterNodeProps {
  chapter: Chapter;
  sections: Section[];
  onFileSelect: (filePath: string | null) => void;
}

export const ChapterNode: Component<ChapterNodeProps> = (props) => {
  const [contextMenu, setContextMenu] = createSignal<{ x: number; y: number } | null>(null);
  const [addingSection, setAddingSection] = createSignal<{ index: number; position: 'above' | 'below' } | null>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleAddSection = () => {
    setContextMenu(null);
    // Add at the end - use the last section's index with 'below' position
    const lastIndex = props.sections.length - 1;
    if (lastIndex >= 0) {
      startAddingSection(lastIndex, 'below');
    } else {
      // No sections yet, create the first one
      startAddingSection(0, 'below');
    }
  };

  const startAddingSection = (index: number, position: 'above' | 'below') => {
    setAddingSection({ index, position });
  };

  const createSectionWithName = async (sectionName: string) => {
    try {
      const addInfo = addingSection();
      if (!addInfo) return;

      const { index, position } = addInfo;
      const targetSection = props.sections[index];
      console.log('createSectionWithName:', { sectionName, targetSection, position, index });

      // Get all level-1 sections (H2 sections, not the chapter title)
      const level1Sections = props.sections.filter(s => s.level === 1);
      console.log('level1Sections:', level1Sections);
      
      let insertNum: number;
      
      if (targetSection.level === 0) {
        // Chapter title - insert as first H2 section
        insertNum = 1;
      } else {
        // For H2 sections
        const targetNum = parseInt(targetSection.section2Num);
        insertNum = position === 'above' ? targetNum : targetNum + 1;
      }

      console.log('insertNum:', insertNum);

      // Renumber all sections at or after the insert position
      const sectionsToRenumber = level1Sections
        .filter(s => parseInt(s.section2Num) >= insertNum)
        .sort((a, b) => parseInt(b.section2Num) - parseInt(a.section2Num)); // Descending order

      console.log('sectionsToRenumber:', sectionsToRenumber);

      for (const section of sectionsToRenumber) {
        const oldNum = parseInt(section.section2Num);
        const newNum = oldNum + 1;
        const newSection2Num = newNum.toString().padStart(2, '0');
        
        const newFileName = section.fileName.replace(
          /^(\d+|[A-Z])-(\d+)-/,
          `$1-${newSection2Num}-`
        );
        const newPath = `${props.chapter.folderPath}/${newFileName}`;

        console.log('Renaming:', { oldPath: section.filePath, newPath });
        await invoke('rename_path', {
          oldPath: section.filePath,
          newPath
        });
      }

      // Create the new section
      const section2Num = insertNum.toString().padStart(2, '0');
      const fileName = `${props.chapter.chapterNum}-${section2Num}-00-00 ${sectionName}.md`;
      const filePath = `${props.chapter.folderPath}/${fileName}`;

      const content = `## ${props.chapter.chapterNum}.${insertNum} ${sectionName}\n\nSection content goes here.\n`;
      
      console.log('Creating new section:', filePath);
      await invoke('write_file', {
        path: filePath,
        contents: content
      });

      console.log('Created new section:', filePath);

      setAddingSection(null);

      // Trigger refresh
      await bookStoreActions.refreshBook();
    } catch (error) {
      console.error('Failed to add section:', error);
      alert(`Failed to add section: ${error}`);
      setAddingSection(null);
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    await moveSection(props.sections, props.chapter.folderPath, index, direction);
  };

  return (
    <div class="chapter-node">
      <ChapterHeader
        chapter={props.chapter}
        sectionCount={props.sections.length}
        onContextMenu={handleContextMenu}
      >
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

        <div class="sections-container">
          <For each={props.sections}>
            {(file, index) => {
              const showInputAbove = () => {
                const adding = addingSection();
                return adding && adding.index === index() && adding.position === 'above';
              };
              const showInputBelow = () => {
                const adding = addingSection();
                return adding && adding.index === index() && adding.position === 'below';
              };
              
              return (
                <>
                  <Show when={showInputAbove()}>
                    <InlineInput
                      placeholder="Section name..."
                      onSave={createSectionWithName}
                      onCancel={() => setAddingSection(null)}
                    />
                  </Show>
                  <SectionNode 
                    section={file}
                    metadata={{
                      isFirst: index() === 0,
                      isLast: index() === props.sections.length - 1,
                      isChapterTitle: file.level === 0
                    }}
                    onFileSelect={props.onFileSelect}
                    onMove={(direction) => handleMoveSection(index(), direction)}
                    onAddSection={(position) => startAddingSection(index(), position)}
                  />
                  <Show when={showInputBelow()}>
                    <InlineInput
                      placeholder="Section name..."
                      onSave={createSectionWithName}
                      onCancel={() => setAddingSection(null)}
                    />
                  </Show>
                </>
              );
            }}
          </For>
        </div>
      </ChapterHeader>
    </div>
  );
};

async function moveSection(
  sections: Section[],
  chapterFolderPath: string,
  index: number,
  direction: 'up' | 'down'
) {
  if (direction === 'up' && index === 0) return;
  if (direction === 'down' && index === sections.length - 1) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  const section1 = sections[index];
  const section2 = sections[newIndex];

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

    const newPath1 = `${chapterFolderPath}/${newFileName1}`;
    const newPath2 = `${chapterFolderPath}/${newFileName2}`;

    console.log('Renaming files:', {
      from1: section1.filePath, to1: newPath1,
      from2: section2.filePath, to2: newPath2
    });

    // Use temp file to avoid conflicts
    const tempPath = `${chapterFolderPath}/.temp-swap-${Date.now()}.md`;
    
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
    await bookStoreActions.refreshBook();
  } catch (error) {
    console.error('Failed to move section:', error);
    alert(`Failed to move section: ${error}`);
  }
}
