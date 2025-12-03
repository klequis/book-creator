import { Component, Show, createSignal, onMount, createEffect, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';
import MarkdownIt from 'markdown-it';
import { markdownKeywordPlugin } from '../utils/markdownKeywordPlugin';
import { load } from '@tauri-apps/plugin-store';
import './MarkdownPreview.css';

const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  linkify: true,     // Autoconvert URL-like text to links
  typographer: true  // Enable smartquotes and other sweet transforms
});

// Apply custom keyword plugin
md.use(markdownKeywordPlugin);

interface MarkdownPreviewProps {
  filePath: string | null;
  resourcesPath: string | null;
  content: string | null;
}

export const MarkdownPreview: Component<MarkdownPreviewProps> = (props) => {
  const [zoom, setZoom] = createSignal(180);
  const [previewState, setPreviewState] = createStore({
    html: '',
    loading: false,
    error: null as string | null
  });
  
  let store: Awaited<ReturnType<typeof load>> | null = null;
  let renderTimeout: number | undefined;

  // Load saved zoom level
  onMount(async () => {
    try {
      store = await load('settings.json');
      const savedZoom = await store.get<number>('previewZoom');
      if (savedZoom) {
        setZoom(savedZoom);
      }
    } catch (err) {
      console.error('Failed to load preview zoom:', err);
    }
  });

  onCleanup(() => {
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }
  });

  const saveZoom = async (newZoom: number) => {
    try {
      if (!store) {
        store = await load('settings.json');
      }
      await store.set('previewZoom', newZoom);
      await store.save();
    } catch (err) {
      console.error('Failed to save preview zoom:', err);
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom() + 10, 300);
    setZoom(newZoom);
    saveZoom(newZoom);
  };
  
  const zoomOut = () => {
    const newZoom = Math.max(zoom() - 10, 50);
    setZoom(newZoom);
    saveZoom(newZoom);
  };
  
  const resetZoom = () => {
    setZoom(180);
    saveZoom(180);
  };

  const shortenPath = (path: string) => {
    return path.replace(/^\/home\/[^/]+\//, '~/');
  };

  // Debounced rendering effect
  createEffect(() => {
    const markdown = props.content;
    const resourcesPath = props.resourcesPath;
    const filePath = props.filePath;

    if (!markdown || !filePath) {
      setPreviewState({ html: '', loading: false, error: null });
      return;
    }

    // Clear previous timeout
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }

    // Debounce rendering by 300ms (increased for less frequent updates)
    renderTimeout = window.setTimeout(async () => {
      try {
        let processedMarkdown = markdown;
        
        // Process images before converting markdown to HTML
        if (resourcesPath) {
          const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
          const matches = Array.from(processedMarkdown.matchAll(imgRegex));
          
          for (const match of matches) {
            const [fullMatch, alt, src] = match;
            
            // Skip absolute URLs
            if (src.match(/^(https?:\/\/|\/)/)) continue;
            
            let fullPath: string;
            
            if (src.includes('../') || src.includes('./')) {
              // Resolve relative to the markdown file's directory
              const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));
              fullPath = `${fileDir}/${src}`;
              // Normalize the path
              const parts = fullPath.split('/');
              const normalized: string[] = [];
              for (const part of parts) {
                if (part === '..') {
                  normalized.pop();
                } else if (part !== '.' && part !== '') {
                  normalized.push(part);
                }
              }
              fullPath = '/' + normalized.join('/');
            } else {
              fullPath = `${resourcesPath}/${src}`;
            }
            
            try {
              const base64Data: string = await invoke('read_binary_file', { path: fullPath });
              const ext = fullPath.split('.').pop()?.toLowerCase();
              const mimeTypes: { [key: string]: string } = {
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'webp': 'image/webp'
              };
              const mimeType = mimeTypes[ext || ''] || 'image/png';
              const dataUrl = `data:${mimeType};base64,${base64Data}`;
              processedMarkdown = processedMarkdown.replace(fullMatch, `![${alt}](${dataUrl})`);
            } catch (error) {
              console.error(`Failed to load image ${fullPath}:`, error);
            }
          }
        }
        
        const html = md.render(processedMarkdown);
        setPreviewState({ html, loading: false, error: null });
      } catch (error) {
        console.error('Failed to render markdown:', error);
        setPreviewState({
          html: '',
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }, 150);
  });
  
  return (
    <div class="markdown-preview">
      <Show 
        when={props.filePath}
        fallback={
          <div class="preview-placeholder">
            <div class="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p>Select a file to preview</p>
            </div>
          </div>
        }
      >
        <Show when={previewState.loading}>
          <div class="preview-loading">Rendering...</div>
        </Show>
        <Show when={previewState.error}>
          <div class="preview-error">
            <h3>Error rendering preview</h3>
            <p>{previewState.error}</p>
          </div>
        </Show>
        <Show when={!previewState.loading && !previewState.error}>
          <div class="preview-header">
            <div class="preview-file-path">{shortenPath(props.filePath!)}</div>
            <div class="zoom-controls">
              <button onClick={zoomOut} title="Zoom out">−</button>
              <button onClick={resetZoom} title="Reset zoom">{zoom()}%</button>
              <button onClick={zoomIn} title="Zoom in">+</button>
            </div>
          </div>
          <div class="preview-content" style={{ "font-size": `${zoom()}%` }} innerHTML={previewState.html}></div>
        </Show>
      </Show>
    </div>
  );
};
