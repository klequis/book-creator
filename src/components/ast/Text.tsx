import { Component } from 'solid-js';
import type { TextNode } from '../../types/ast';

export const Text: Component<{ node: TextNode }> = (props) => {
  return <>{props.node.value}</>;
};
