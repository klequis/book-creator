import { Component, For } from 'solid-js';
import type { EmphasisNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Emphasis: Component<{ node: EmphasisNode }> = (props) => {
  return (
    <em>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </em>
  );
};
