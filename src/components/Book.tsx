import { Component, For, Show } from 'solid-js';
import type { BookStructure } from '../types/book';
import { PartNode } from './PartNode';

interface BookProps {
  structure: BookStructure;
}

export const Book: Component<BookProps> = (props) => {
  console.log('[Book] Rendering with structure:', props.structure);
  console.log('[Book] Parts:', props.structure.parts.length);
  console.log('[Book] Introduction:', props.structure.introduction);
  console.log('[Book] Appendices:', props.structure.appendices.length);

  return (
    <div class="tree-content">
      {/* Introduction */}
      <Show when={props.structure.introduction}>
        {(intro) => {
          console.log('[Book] Rendering introduction');
          return (
            <PartNode 
              part={{
                folderPath: intro().folderPath,
                folderName: 'Introduction',
                partNum: '',
                title: 'Introduction',
                chapters: [intro()]
              }}
              isIntroduction={true}
            />
          );
        }}
      </Show>

      {/* Parts and Chapters */}
      <For each={props.structure.parts}>
        {(part, index) => {
          console.log(`[Book] Rendering part ${index()}:`, part);
          return <PartNode part={part} />;
        }}
      </For>

      {/* Appendices */}
      <Show when={props.structure.appendices.length > 0}>
        <PartNode 
          part={{
            folderPath: props.structure.rootPath,
            folderName: 'Appendices',
            partNum: '',
            title: 'Appendices',
            chapters: props.structure.appendices
          }}
          isAppendix={true}
        />
      </Show>
    </div>
  );
};
