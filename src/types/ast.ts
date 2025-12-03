/**
 * AST node types for markdown content
 * Based on markdown-it-ast output
 */

export type ASTNodeType = 
  | 'root'
  | 'heading'
  | 'paragraph'
  | 'text'
  | 'strong'
  | 'emphasis'
  | 'code_inline'
  | 'code_block'
  | 'link'
  | 'image'
  | 'list'
  | 'list_item'
  | 'blockquote'
  | 'hr'
  | 'table'
  | 'keyword'; // Custom type for #keyword syntax

export interface BaseASTNode {
  type: ASTNodeType;
  children?: ASTNode[];
}

export interface RootNode extends BaseASTNode {
  type: 'root';
  children: ASTNode[];
}

export interface HeadingNode extends BaseASTNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ASTNode[];
}

export interface ParagraphNode extends BaseASTNode {
  type: 'paragraph';
  children: ASTNode[];
}

export interface TextNode extends BaseASTNode {
  type: 'text';
  value: string;
}

export interface StrongNode extends BaseASTNode {
  type: 'strong';
  children: ASTNode[];
}

export interface EmphasisNode extends BaseASTNode {
  type: 'emphasis';
  children: ASTNode[];
}

export interface CodeInlineNode extends BaseASTNode {
  type: 'code_inline';
  value: string;
}

export interface CodeBlockNode extends BaseASTNode {
  type: 'code_block';
  value: string;
  language?: string;
}

export interface LinkNode extends BaseASTNode {
  type: 'link';
  href: string;
  title?: string;
  children: ASTNode[];
}

export interface ImageNode extends BaseASTNode {
  type: 'image';
  src: string;
  alt?: string;
  title?: string;
}

export interface ListNode extends BaseASTNode {
  type: 'list';
  ordered: boolean;
  start?: number;
  children: ListItemNode[];
}

export interface ListItemNode extends BaseASTNode {
  type: 'list_item';
  children: ASTNode[];
}

export interface BlockquoteNode extends BaseASTNode {
  type: 'blockquote';
  children: ASTNode[];
}

export interface HRNode extends BaseASTNode {
  type: 'hr';
}

export interface TableNode extends BaseASTNode {
  type: 'table';
  children: ASTNode[];
}

export interface KeywordNode extends BaseASTNode {
  type: 'keyword';
  keyword: string;
}

export type ASTNode =
  | RootNode
  | HeadingNode
  | ParagraphNode
  | TextNode
  | StrongNode
  | EmphasisNode
  | CodeInlineNode
  | CodeBlockNode
  | LinkNode
  | ImageNode
  | ListNode
  | ListItemNode
  | BlockquoteNode
  | HRNode
  | TableNode
  | KeywordNode;
