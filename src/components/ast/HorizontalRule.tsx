import { Component } from 'solid-js';
import type { HRNode } from '../../types/ast';

export const HorizontalRule: Component<{ node: HRNode }> = () => {
  return <hr />;
};
