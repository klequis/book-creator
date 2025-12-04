import { Component, For } from 'solid-js';
import type { BlockquoteNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Blockquote: Component<{ node: BlockquoteNode }> = (props) => {
  const classes = () => {
    const base = 'blockquote';
    return props.node.calloutType ? `${base} callout callout-${props.node.calloutType}` : base;
  };

  return (
    <blockquote class={classes()}>
      {props.node.calloutType && (
        <div class="callout-title">{props.node.calloutType.toUpperCase()}</div>
      )}
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </blockquote>
  );
};
