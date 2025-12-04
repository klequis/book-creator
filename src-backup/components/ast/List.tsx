import { Component, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { ListNode, ListItemNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const List: Component<{ node: ListNode }> = (props) => {
  const Tag = () => (props.node.ordered ? 'ol' : 'ul');
  
  return (
    <Dynamic component={Tag()} start={props.node.start}>
      <For each={props.node.children}>
        {(child) => <ListItem node={child} />}
      </For>
    </Dynamic>
  );
};

const ListItem: Component<{ node: ListItemNode }> = (props) => {
  return (
    <li>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </li>
  );
};
