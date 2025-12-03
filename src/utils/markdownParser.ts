/**
 * Convert markdown-it tokens to AST
 */
import MarkdownIt from 'markdown-it';
import type { ASTNode, RootNode } from '../types/ast';

export function markdownToAST(md: MarkdownIt, markdown: string): RootNode {
  const tokens = md.parse(markdown, {});
  const root: RootNode = {
    type: 'root',
    children: []
  };

  let i = 0;
  while (i < tokens.length) {
    const node = parseToken(tokens, i);
    if (node) {
      root.children.push(node.node);
      i = node.nextIndex;
    } else {
      i++;
    }
  }

  return root;
}

function parseToken(tokens: any[], startIndex: number): { node: ASTNode; nextIndex: number } | null {
  const token = tokens[startIndex];

  switch (token.type) {
    case 'heading_open': {
      const level = parseInt(token.tag.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6;
      const contentIndex = startIndex + 1;
      const children = parseInlineContent(tokens[contentIndex]);
      return {
        node: {
          type: 'heading',
          level,
          children
        },
        nextIndex: startIndex + 3 // _open, inline, _close
      };
    }

    case 'paragraph_open': {
      const contentIndex = startIndex + 1;
      const children = parseInlineContent(tokens[contentIndex]);
      return {
        node: {
          type: 'paragraph',
          children
        },
        nextIndex: startIndex + 3
      };
    }

    case 'bullet_list_open':
    case 'ordered_list_open': {
      const ordered = token.type === 'ordered_list_open';
      const children: any[] = [];
      let i = startIndex + 1;
      
      while (i < tokens.length && tokens[i].type !== 'bullet_list_close' && tokens[i].type !== 'ordered_list_close') {
        if (tokens[i].type === 'list_item_open') {
          const itemResult = parseListItem(tokens, i);
          if (itemResult) {
            children.push(itemResult.node);
            i = itemResult.nextIndex;
          } else {
            i++;
          }
        } else {
          i++;
        }
      }

      return {
        node: {
          type: 'list',
          ordered,
          start: token.attrGet('start'),
          children
        },
        nextIndex: i + 1
      };
    }

    case 'blockquote_open': {
      const children: any[] = [];
      let i = startIndex + 1;
      
      while (i < tokens.length && tokens[i].type !== 'blockquote_close') {
        const result = parseToken(tokens, i);
        if (result) {
          children.push(result.node);
          i = result.nextIndex;
        } else {
          i++;
        }
      }

      return {
        node: {
          type: 'blockquote',
          children
        },
        nextIndex: i + 1
      };
    }

    case 'code_block':
    case 'fence': {
      return {
        node: {
          type: 'code_block',
          value: token.content,
          language: token.info || undefined
        },
        nextIndex: startIndex + 1
      };
    }

    case 'hr': {
      return {
        node: {
          type: 'hr'
        },
        nextIndex: startIndex + 1
      };
    }

    default:
      return null;
  }
}

function parseListItem(tokens: any[], startIndex: number): { node: any; nextIndex: number } | null {
  const children: any[] = [];
  let i = startIndex + 1;
  
  while (i < tokens.length && tokens[i].type !== 'list_item_close') {
    const result = parseToken(tokens, i);
    if (result) {
      children.push(result.node);
      i = result.nextIndex;
    } else {
      i++;
    }
  }

  return {
    node: {
      type: 'list_item',
      children
    },
    nextIndex: i + 1
  };
}

function parseInlineContent(token: any): ASTNode[] {
  if (!token || !token.children) return [];
  
  const nodes: ASTNode[] = [];
  
  for (const child of token.children) {
    switch (child.type) {
      case 'text':
        // Check if it's a keyword
        const keywordMatch = child.content.match(/#(\w+)/);
        if (keywordMatch) {
          // Split text around keyword
          const parts = child.content.split(/#(\w+)/);
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0 && parts[i]) {
              nodes.push({ type: 'text', value: parts[i] });
            } else if (i % 2 === 1 && parts[i]) {
              nodes.push({ type: 'keyword', keyword: parts[i] });
            }
          }
        } else {
          nodes.push({ type: 'text', value: child.content });
        }
        break;

      case 'softbreak':
        // Handle soft line breaks (single newline in markdown)
        nodes.push({ type: 'text', value: '\n' });
        break;

      case 'hardbreak':
        // Handle hard line breaks (two spaces + newline)
        nodes.push({ type: 'text', value: '\n' });
        break;

      case 'strong_open': {
        const contentNodes: ASTNode[] = [];
        let i = token.children.indexOf(child) + 1;
        while (i < token.children.length && token.children[i].type !== 'strong_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          i++;
        }
        nodes.push({ type: 'strong', children: contentNodes });
        break;
      }

      case 'em_open': {
        const contentNodes: ASTNode[] = [];
        let i = token.children.indexOf(child) + 1;
        while (i < token.children.length && token.children[i].type !== 'em_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          i++;
        }
        nodes.push({ type: 'emphasis', children: contentNodes });
        break;
      }

      case 'code_inline':
        nodes.push({ type: 'code_inline', value: child.content });
        break;

      case 'link_open': {
        const href = child.attrGet('href') || '';
        const title = child.attrGet('title') || undefined;
        const contentNodes: ASTNode[] = [];
        let i = token.children.indexOf(child) + 1;
        while (i < token.children.length && token.children[i].type !== 'link_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          i++;
        }
        nodes.push({ type: 'link', href, title, children: contentNodes });
        break;
      }

      case 'image': {
        const src = child.attrGet('src') || '';
        const alt = child.content || undefined;
        const title = child.attrGet('title') || undefined;
        nodes.push({ type: 'image', src, alt, title });
        break;
      }
    }
  }
  
  return nodes;
}
