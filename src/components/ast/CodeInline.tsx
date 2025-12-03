import { Component } from 'solid-js';
import type { CodeInlineNode } from '../../types/ast';

export const CodeInline: Component<{ node: CodeInlineNode }> = (props) => {
  return <code>{props.node.value}</code>;
};
