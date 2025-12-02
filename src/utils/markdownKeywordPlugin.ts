/**
 * markdown-it plugin for custom keyword syntax
 * Transforms #word and #word-word into styled spans
 */

import type MarkdownIt from 'markdown-it';

interface StateInline {
  pos: number;
  posMax: number;
  src: string;
  push(type: string, tag: string, nesting: number): any;
}

function keywordRule(state: StateInline, silent: boolean): boolean {
  const pos = state.pos;
  const max = state.posMax;
  
  // Must start with #
  if (state.src.charCodeAt(pos) !== 0x23 /* # */) {
    return false;
  }
  
  // Check if this looks like a markdown heading (# at start of line or after whitespace)
  if (pos === 0 || /\s/.test(state.src[pos - 1])) {
    // Check if there's a space after # (markdown heading: "# Title")
    if (pos + 1 < max && state.src.charCodeAt(pos + 1) === 0x20 /* space */) {
      return false;
    }
  }
  
  // Must be followed by a letter
  if (pos + 1 >= max || !/[a-zA-Z]/.test(state.src[pos + 1])) {
    return false;
  }
  
  // Find the end of the keyword (letters, numbers, hyphens)
  let endPos = pos + 1;
  while (endPos < max && /[a-zA-Z0-9-]/.test(state.src[endPos])) {
    endPos++;
  }
  
  // Must end at word boundary (space, punctuation, or end of string)
  if (endPos < max && /[a-zA-Z0-9]/.test(state.src[endPos])) {
    return false;
  }
  
  // Don't consume trailing hyphen
  if (state.src[endPos - 1] === '-') {
    endPos--;
  }
  
  // Must have at least one character after #
  if (endPos <= pos + 1) {
    return false;
  }
  
  if (!silent) {
    const token = state.push('keyword', 'span', 0);
    token.content = state.src.slice(pos, endPos);
    token.markup = '#';
  }
  
  state.pos = endPos;
  return true;
}

export function markdownKeywordPlugin(md: MarkdownIt): void {
  md.inline.ruler.after('emphasis', 'keyword', keywordRule);
  
  md.renderer.rules.keyword = (tokens, idx) => {
    const token = tokens[idx];
    return `<span class="keyword">${md.utils.escapeHtml(token.content)}</span>`;
  };
}
