import { Component, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { HeadingNode } from '../../types/ast';
import { ASTNodeRenderer } from './ASTNodeRenderer';

export const Heading: Component<{ node: HeadingNode }> = (props) => {
  const Tag = () => `h${props.node.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  return (
    <Dynamic component={Tag()}>
      <For each={props.node.children}>
        {(child) => <ASTNodeRenderer node={child} />}
      </For>
    </Dynamic>
  );
};
