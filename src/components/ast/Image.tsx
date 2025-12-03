import { Component } from 'solid-js';
import type { ImageNode } from '../../types/ast';

export const Image: Component<{ node: ImageNode }> = (props) => {
  return <img src={props.node.src} alt={props.node.alt} title={props.node.title} />;
};
