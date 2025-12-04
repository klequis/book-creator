import { Component, For } from 'solid-js';
import type { ParagraphNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Paragraph: Component<{ node: ParagraphNode }> = (props) => {
  return (
    <p>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </p>
  );
};
