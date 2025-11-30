import { Component, createResource, Show, createSignal, onMount } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import { load } from '@tauri-apps/plugin-store';
import { convertFileSrc } from '@tauri-apps/api/core';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
  filePath: string | null;
  resourcesPath: string | null;
}

export const MarkdownPreview: Component<MarkdownPreviewProps> = (props) => {
  const [zoom, setZoom] = createSignal(180);
  let store: Awaited<ReturnType<typeof load>> | null = null;

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
  const [content] = createResource(
    () => [props.filePath, props.resourcesPath] as const,
    async ([path, resourcesPath]) => {
      if (!path) return null;
      try {
        const markdown: string = await invoke('read_file', { path });
        
        // Configure marked to use hooks for image processing
        marked.use({
          hooks: {
            postprocess(html) {
              if (!resourcesPath) return html;
              
              // Replace relative image paths with converted asset URLs
              return html.replace(
                /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi,
                (match, before, src, after) => {
                  // If src is relative (doesn't start with http:// or https:// or /)
                  if (!src.match(/^(https?:\/\/|\/)/)) {
                    let fullPath: string;
                    
                    // Check if it's a relative path with ../ or ./
                    if (src.includes('../') || src.includes('./')) {
                      // Resolve relative to the markdown file's directory
                      const fileDir = path.substring(0, path.lastIndexOf('/'));
                      fullPath = `${fileDir}/${src}`;
                      // Normalize the path (remove .. and .)
                      const parts = fullPath.split('/');
                      const normalized: string[] = [];
                      for (const part of parts) {
                        if (part === '..') {
                          normalized.pop();
                        } else if (part !== '.' && part !== '') {
                          normalized.push(part);
                        }
                      }
                      fullPath = normalized.join('/');
                    } else {
                      // Assume it's just a filename in the resources folder
                      fullPath = `${resourcesPath}/${src}`;
                    }
                    
                    const assetUrl = convertFileSrc(fullPath);
                    console.log(`Image src: ${src} -> ${fullPath} -> ${assetUrl}`);
                    return `<img ${before}src="${assetUrl}"${after}>`;
                  }
                  return match;
                }
              );
            }
          }
        });
        
        const html = await marked(markdown);
        return html;
      } catch (error) {
        console.error('Failed to load file:', error);
        throw error;
      }
    }
  );

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
        <Show when={content.loading}>
          <div class="preview-loading">Loading...</div>
        </Show>
        <Show when={content.error}>
          <div class="preview-error">
            <h3>Error loading file</h3>
            <p>{content.error instanceof Error ? content.error.message : 'Unknown error'}</p>
          </div>
        </Show>
        <Show when={content() && !content.loading && !content.error}>
          <div class="preview-header">
            <div class="preview-file-path">{props.filePath}</div>
            <div class="zoom-controls">
              <button onClick={zoomOut} title="Zoom out">−</button>
              <button onClick={resetZoom} title="Reset zoom">{zoom()}%</button>
              <button onClick={zoomIn} title="Zoom in">+</button>
            </div>
          </div>
          <div class="preview-content" style={{ "font-size": `${zoom()}%` }} innerHTML={content() || ''}></div>
        </Show>
      </Show>
    </div>
  );
};
