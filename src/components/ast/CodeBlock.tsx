import { Component } from 'solid-js';
import type { CodeBlockNode } from '../../types/ast';

export const CodeBlock: Component<{ node: CodeBlockNode }> = (props) => {
  return (
    <pre>
      <code class={props.node.language ? `language-${props.node.language}` : ''}>
        {props.node.value}
      </code>
    </pre>
  );
};
