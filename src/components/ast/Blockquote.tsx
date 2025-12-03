import { Component, For } from 'solid-js';
import type { BlockquoteNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Blockquote: Component<{ node: BlockquoteNode }> = (props) => {
  return (
    <blockquote>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </blockquote>
  );
};
