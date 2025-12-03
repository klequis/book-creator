import { Component, createEffect, onMount } from 'solid-js';
import type { KeywordNode } from '../../types/ast';

export const Keyword: Component<{ node: KeywordNode }> = (props) => {
  // onMount runs once when component is created
  onMount(() => {
    console.log('[Keyword] Component mounted with keyword:', props.node.keyword);
  });
  
  // createEffect tracks reactive dependencies
  createEffect(() => {
    // Explicitly access the reactive value to track it
    const keyword = props.node.keyword;
    console.log('[Keyword] Effect triggered for:', keyword);
  });
  
  return <span class="keyword" data-keyword={props.node.keyword}>{props.node.keyword}</span>;
};
