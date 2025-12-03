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
      // First, check if this is a callout by looking ahead at the first inline token
      let calloutType: string | undefined;
      let shouldRemoveCalloutMarker = false;
      
      // Look for the first inline token (should be in first paragraph)
      if (tokens[startIndex + 1]?.type === 'paragraph_open' && tokens[startIndex + 2]) {
        const firstInlineToken = tokens[startIndex + 2];
        if (firstInlineToken.content) {
          const calloutMatch = firstInlineToken.content.match(/^\[!(\w+)\]/);
          if (calloutMatch) {
            calloutType = calloutMatch[1].toLowerCase();
            shouldRemoveCalloutMarker = true;

          }
        }
      }
      
      // Now parse children normally
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
      
      // Post-process: remove callout marker from first paragraph if needed
      if (shouldRemoveCalloutMarker && children.length > 0 && children[0].type === 'paragraph' && children[0].children) {
        const firstPara = children[0];
        if (firstPara.children[0]?.type === 'text' && firstPara.children[0].value.startsWith('[!')) {
          // Remove the first text node containing the callout marker
          firstPara.children.shift();

        }
      }

      return {
        node: {
          type: 'blockquote',
          calloutType,
          children
        } as any,
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
  
  console.log('[parseInlineContent] Token content:', token.content);
  console.log('[parseInlineContent] Children:', token.children?.map((c: any) => ({ type: c.type, content: c.content })));
  
  const nodes: ASTNode[] = [];
  const processedIndices = new Set<number>();
  
  for (let idx = 0; idx < token.children.length; idx++) {
    if (processedIndices.has(idx)) continue;
    
    const child = token.children[idx];
    
    switch (child.type) {
      case 'text':
        // Parse text with keywords
        nodes.push(...parseTextWithKeywords(child.content));
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
        let i = idx + 1;
        while (i < token.children.length && token.children[i].type !== 'strong_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          processedIndices.add(i);
          i++;
        }
        processedIndices.add(i); // Mark strong_close as processed
        nodes.push({ type: 'strong', children: contentNodes });
        break;
      }

      case 'em_open': {
        const contentNodes: ASTNode[] = [];
        let i = idx + 1;
        while (i < token.children.length && token.children[i].type !== 'em_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          processedIndices.add(i);
          i++;
        }
        processedIndices.add(i); // Mark em_close as processed
        nodes.push({ type: 'emphasis', children: contentNodes });
        break;
      }

      case 'code_inline':
        nodes.push({ type: 'code_inline', value: child.content });
        break;

      case 'keyword':
        // Handle keyword tokens created by markdown-it
        nodes.push({ type: 'keyword', keyword: child.content });
        break;

      case 'link_open': {
        const href = child.attrGet('href') || '';
        const title = child.attrGet('title') || undefined;
        const contentNodes: ASTNode[] = [];
        let i = idx + 1;
        while (i < token.children.length && token.children[i].type !== 'link_close') {
          if (token.children[i].type === 'text') {
            contentNodes.push({ type: 'text', value: token.children[i].content });
          }
          processedIndices.add(i);
          i++;
        }
        processedIndices.add(i); // Mark link_close as processed
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

/**
 * Parse text content and extract keywords
 */
function parseTextWithKeywords(text: string): ASTNode[] {
  console.log('[parseTextWithKeywords] Input text:', text);
  const nodes: ASTNode[] = [];
  const regex = /#(\w+)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    console.log('[parseTextWithKeywords] Found keyword:', match[1], 'at index:', match.index);
    // Add text before keyword
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: text.substring(lastIndex, match.index) });
    }
    // Add keyword
    nodes.push({ type: 'keyword', keyword: match[1] });
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push({ type: 'text', value: text.substring(lastIndex) });
  }
  
  // If no keywords found, return single text node
  if (nodes.length === 0) {
    nodes.push({ type: 'text', value: text });
  }
  
  console.log('[parseTextWithKeywords] Output nodes:', nodes.length, 'nodes');
  return nodes;
}
