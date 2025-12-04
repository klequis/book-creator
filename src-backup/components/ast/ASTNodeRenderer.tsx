import { Component, Match, Switch } from 'solid-js';
import type { ASTNode } from '../../types/ast';
import { Heading } from './Heading';
import { Paragraph } from './Paragraph';
import { Text } from './Text';
import { Strong } from './Strong';
import { Emphasis } from './Emphasis';
import { CodeInline } from './CodeInline';
import { CodeBlock } from './CodeBlock';
import { Link } from './Link';
import { Image } from './Image';
import { List } from './List';
import { Blockquote } from './Blockquote';
import { HorizontalRule } from './HorizontalRule';
import { Keyword } from './Keyword';

export const ASTNodeRenderer: Component<{ node: ASTNode }> = (props) => {
  return (
    <Switch>
      <Match when={props.node.type === 'heading'}>
        <Heading node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'paragraph'}>
        <Paragraph node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'text'}>
        <Text node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'strong'}>
        <Strong node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'emphasis'}>
        <Emphasis node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'code_inline'}>
        <CodeInline node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'code_block'}>
        <CodeBlock node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'link'}>
        <Link node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'image'}>
        <Image node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'list'}>
        <List node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'blockquote'}>
        <Blockquote node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'hr'}>
        <HorizontalRule node={props.node as any} />
      </Match>
      <Match when={props.node.type === 'keyword'}>
        <Keyword node={props.node as any} />
      </Match>
    </Switch>
  );
};
