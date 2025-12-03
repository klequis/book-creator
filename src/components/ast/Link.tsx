import { Component, For } from 'solid-js';
import type { LinkNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Link: Component<{ node: LinkNode }> = (props) => {
  return (
    <a href={props.node.href} title={props.node.title}>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </a>
  );
};
