import { Component } from 'solid-js';
import type { KeywordNode } from '../../types/ast';

export const Keyword: Component<{ node: KeywordNode }> = (props) => {
  return <span class="keyword" data-keyword={props.node.keyword}>#{props.node.keyword}</span>;
};
