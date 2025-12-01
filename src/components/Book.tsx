import { Component, For, Show, createMemo } from 'solid-js';
import type { Book as BookStructure } from '../types/book';
import { PartNode } from './PartNode';
import { ResourcesNode } from './ResourcesNode';

interface BookProps {
  structure: BookStructure;
  onFileSelect: (filePath: string | null) => void;
}

export const Book: Component<BookProps> = (props) => {
  console.log('[Book] Rendering with structure:', props.structure);
  console.log('[Book] Book Parts:', props.structure.bookParts.length);
  console.log('[Book] Chapters:', props.structure.chapters.length);
  console.log('[Book] Sections:', props.structure.sections.length);

  // Group chapters by their relationships
  const introduction = createMemo(() => 
    props.structure.chapters.find(ch => ch.isIntroduction)
  );

  const appendices = createMemo(() => 
    props.structure.chapters.filter(ch => ch.isAppendix)
  );

  const standaloneChapters = createMemo(() => {
    const chapters = props.structure.chapters.filter(ch => !ch.bookPartId && !ch.isIntroduction && !ch.isAppendix);
    // Sort by chapter number
    chapters.sort((a, b) => parseInt(a.chapterNum) - parseInt(b.chapterNum));
    return chapters;
  });

  // Helper to get chapters for a part
  const getChaptersForPart = (partId: string) => 
    props.structure.chapters.filter(ch => ch.bookPartId === partId);

  // Helper to get sections for a chapter
  const getSectionsForChapter = (chapterId: string) => 
    props.structure.sections.filter(sec => sec.chapterId === chapterId);

  return (
    <div class="tree-content">
      {/* Introduction */}
      <Show when={introduction()}>
        {(intro) => {
          console.log('[Book] Rendering introduction');
          const introSections = getSectionsForChapter(intro().id);
          return (
            <PartNode 
              part={{
                id: 'intro-part',
                folderPath: intro().folderPath,
                folderName: '',
                partNum: '',
                title: ''
              }}
              chapters={[intro()]}
              sections={introSections}
              onFileSelect={props.onFileSelect}
            />
          );
        }}
      </Show>

      {/* Parts with their chapters */}
      <For each={props.structure.bookParts}>
        {(part, index) => {
          console.log(`[Book] Rendering part ${index()}:`, part);
          const partChapters = getChaptersForPart(part.id);
          const allSections = partChapters.flatMap(ch => getSectionsForChapter(ch.id));
          return <PartNode part={part} chapters={partChapters} sections={allSections} onFileSelect={props.onFileSelect} />;
        }}
      </For>

      {/* Standalone chapters (no part) */}
      <Show when={standaloneChapters().length > 0}>
        <For each={standaloneChapters()}>
          {(chapter) => {
            console.log('[Book] Rendering standalone chapter:', chapter.title);
            const chapterSections = getSectionsForChapter(chapter.id);
            return (
              <PartNode 
                part={{
                  id: `standalone-${chapter.id}`,
                  folderPath: chapter.folderPath,
                  folderName: '',
                  partNum: '',
                  title: ''
                }}
                chapters={[chapter]}
                sections={chapterSections}
                onFileSelect={props.onFileSelect}
              />
            );
          }}
        </For>
      </Show>

      {/* Appendices */}
      <Show when={appendices().length > 0}>
        <PartNode 
          part={{
            id: 'appendices-part',
            folderPath: props.structure.rootPath,
            folderName: 'Appendices',
            partNum: '',
            title: 'Appendices'
          }}
          chapters={appendices()}
          sections={appendices().flatMap(ch => getSectionsForChapter(ch.id))}
          isAppendix={true}
          onFileSelect={props.onFileSelect}
        />
      </Show>

      {/* Resources */}
      <Show when={props.structure.resourcesPath}>
        <ResourcesNode 
          folderPath={props.structure.resourcesPath!}
          onFileSelect={props.onFileSelect}
        />
      </Show>
    </div>
  );
};
