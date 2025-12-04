import { Component, For } from 'solid-js';
import type { StrongNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Strong: Component<{ node: StrongNode }> = (props) => {
  return (
    <strong>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </strong>
  );
};
