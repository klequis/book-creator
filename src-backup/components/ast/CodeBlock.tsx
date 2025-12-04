import { Component, createMemo } from 'solid-js';
import type { CodeBlockNode } from '../../types/ast';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export const CodeBlock: Component<{ node: CodeBlockNode }> = (props) => {
  const highlighted = createMemo(() => {
    if (props.node.language) {
      try {
        return hljs.highlight(props.node.value, { 
          language: props.node.language 
        }).value;
      } catch (e) {
        // Language not supported, return plain text
        return props.node.value;
      }
    }
    return props.node.value;
  });

  return (
    <pre>
      <code 
        class={props.node.language ? `language-${props.node.language}` : ''}
        innerHTML={highlighted()}
      />
    </pre>
  );
};
