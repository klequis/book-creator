import { describe, it, expect } from '@jest/globals';
const MarkdownIt = require('markdown-it');
import { markdownToAST } from './markdownParser';

describe('markdownParser', () => {
  const md = new MarkdownIt();

  describe('keyword parsing', () => {
    it('should parse keywords in regular text', () => {
      const markdown = 'This is a #keyword in text';
      const ast = markdownToAST(md, markdown);
      
      expect(ast.children).toHaveLength(1);
      const paragraph = ast.children[0];
      expect(paragraph.type).toBe('paragraph');
      expect(paragraph.children).toHaveLength(3);
      expect(paragraph.children[0]).toEqual({ type: 'text', value: 'This is a ' });
      expect(paragraph.children[1]).toEqual({ type: 'keyword', keyword: 'keyword' });
      expect(paragraph.children[2]).toEqual({ type: 'text', value: ' in text' });
    });

    it('should parse multiple keywords in text', () => {
      const markdown = 'Use #Core and #Router together';
      const ast = markdownToAST(md, markdown);
      
      const paragraph = ast.children[0];
      expect(paragraph.children).toHaveLength(5);
      expect(paragraph.children[0]).toEqual({ type: 'text', value: 'Use ' });
      expect(paragraph.children[1]).toEqual({ type: 'keyword', keyword: 'Core' });
      expect(paragraph.children[2]).toEqual({ type: 'text', value: ' and ' });
      expect(paragraph.children[3]).toEqual({ type: 'keyword', keyword: 'Router' });
      expect(paragraph.children[4]).toEqual({ type: 'text', value: ' together' });
    });

    it('should parse keywords in blockquotes', () => {
      const markdown = '> This requires #Core to work';
      const ast = markdownToAST(md, markdown);
      
      expect(ast.children).toHaveLength(1);
      const blockquote = ast.children[0];
      expect(blockquote.type).toBe('blockquote');
      expect(blockquote.calloutType).toBeUndefined();
      
      const paragraph = blockquote.children[0];
      expect(paragraph.type).toBe('paragraph');
      expect(paragraph.children).toHaveLength(3);
      expect(paragraph.children[0]).toEqual({ type: 'text', value: 'This requires ' });
      expect(paragraph.children[1]).toEqual({ type: 'keyword', keyword: 'Core' });
      expect(paragraph.children[2]).toEqual({ type: 'text', value: ' to work' });
    });

    it('should parse keywords in callout blockquotes', () => {
      const markdown = '> [!information]\n> A SolidStart project requires #Core and #Router';
      const ast = markdownToAST(md, markdown);
      
      expect(ast.children).toHaveLength(1);
      const blockquote = ast.children[0];
      expect(blockquote.type).toBe('blockquote');
      expect(blockquote.calloutType).toBe('information');
      
      const paragraph = blockquote.children[0];
      expect(paragraph.type).toBe('paragraph');
      
      // Should have: text, keyword, text, keyword
      const children = paragraph.children;
      
      expect(children.some((c: any) => c.type === 'keyword' && c.keyword === 'Core')).toBe(true);
      expect(children.some((c: any) => c.type === 'keyword' && c.keyword === 'Router')).toBe(true);
    });

    it('should parse callout marker and keywords correctly', () => {
      const markdown = '> [!warning]\n> Use #Vite for this project';
      const ast = markdownToAST(md, markdown);
      
      const blockquote = ast.children[0];
      expect(blockquote.calloutType).toBe('warning');
      
      const paragraph = blockquote.children[0];
      const children = paragraph.children;
      
      // Should NOT contain the [!warning] text
      const allText = children
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.value)
        .join('');
      expect(allText).not.toContain('[!warning]');
      
      // Should contain the keyword
      expect(children.some((c: any) => c.type === 'keyword' && c.keyword === 'Vite')).toBe(true);
    });
  });

  describe('link parsing', () => {
    it('should not duplicate link text', () => {
      const markdown = 'Check out [Vite](https://vitejs.dev) for more info';
      const ast = markdownToAST(md, markdown);
      
      const paragraph = ast.children[0];
      expect(paragraph.children).toHaveLength(3);
      
      expect(paragraph.children[0]).toEqual({ type: 'text', value: 'Check out ' });
      expect(paragraph.children[1]).toMatchObject({
        type: 'link',
        href: 'https://vitejs.dev',
        children: [{ type: 'text', value: 'Vite' }]
      });
      expect(paragraph.children[2]).toEqual({ type: 'text', value: ' for more info' });
    });

    it('should handle multiple links', () => {
      const markdown = '[First](url1) and [Second](url2)';
      const ast = markdownToAST(md, markdown);
      
      const paragraph = ast.children[0];
      expect(paragraph.children).toHaveLength(3);
      
      expect(paragraph.children[0]).toMatchObject({ type: 'link' });
      expect(paragraph.children[1]).toEqual({ type: 'text', value: ' and ' });
      expect(paragraph.children[2]).toMatchObject({ type: 'link' });
    });
  });

  describe('callout detection', () => {
    it('should detect information callout', () => {
      const markdown = '> [!information]\n> Some info';
      const ast = markdownToAST(md, markdown);
      
      const blockquote = ast.children[0];
      expect(blockquote.calloutType).toBe('information');
    });

    it('should detect warning callout', () => {
      const markdown = '> [!warning]\n> Be careful';
      const ast = markdownToAST(md, markdown);
      
      const blockquote = ast.children[0];
      expect(blockquote.calloutType).toBe('warning');
    });

    it('should handle regular blockquote without callout', () => {
      const markdown = '> Just a quote';
      const ast = markdownToAST(md, markdown);
      
      const blockquote = ast.children[0];
      expect(blockquote.calloutType).toBeUndefined();
    });
  });
});
