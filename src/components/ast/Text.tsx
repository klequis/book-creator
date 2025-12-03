import { Component, For } from 'solid-js';
import type { TextNode } from '../../types/ast';

export const Text: Component<{ node: TextNode }> = (props) => {
  // Split on newlines and render with <br> tags
  const parts = () => props.node.value.split('\n');
  
  return (
    <>
      <For each={parts()}>
        {(part, index) => (
          <>
            {part}
            {index() < parts().length - 1 && <br />}
          </>
        )}
      </For>
    </>
  );
};
