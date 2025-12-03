import { Component, createSignal, createResource, Show, onMount, onCleanup, createEffect, untrack } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { editorState } from '../stores/editorState';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  filePath: string | null;
  resourcesPath: string | null;
  onFileSaved?: () => void;
  onContentChange?: (content: string) => void;
}

export const MarkdownEditor: Component<MarkdownEditorProps> = (props) => {
  const [content, setContent] = createSignal('');
  const [isSaving, setIsSaving] = createSignal(false);
  const [lastSaved, setLastSaved] = createSignal<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);
  const [zoom, setZoom] = createSignal(180);
  let store: Awaited<ReturnType<typeof load>> | null = null;
  let saveTimeout: number | undefined;
  let editorView: EditorView | undefined;
  let editorContainer: HTMLDivElement | undefined;

  // Load saved zoom level
  onMount(async () => {
    try {
      store = await load('settings.json');
      const savedZoom = await store.get<number>('editorZoom');
      if (savedZoom) {
        setZoom(savedZoom);
      }
    } catch (err) {
      console.error('Failed to load editor zoom:', err);
    }
    
    // Register save callback
    editorState.registerSaveCallback(saveFile);
  });

  onCleanup(() => {
    // Unregister save callback
    editorState.unregisterSaveCallback();
  });

  const saveZoom = async (newZoom: number) => {
    try {
      if (!store) {
        store = await load('settings.json');
      }
      await store.set('editorZoom', newZoom);
      await store.save();
    } catch (err) {
      console.error('Failed to save editor zoom:', err);
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

  const [fileContent] = createResource(
    () => props.filePath,
    async (path) => {
      if (!path) return null;
      try {
        const markdown: string = await invoke('read_file', { path });
        return markdown;
      } catch (error) {
        console.error('Failed to load file:', error);
        throw error;
      }
    }
  );

  const initializeEditor = (container: HTMLDivElement, initialContent: string) => {
    console.log('Initializing editor, content length:', initialContent.length);
    if (editorView) {
      editorView.destroy();
    }

    const startState = EditorState.create({
      doc: initialContent,
      extensions: [
        basicSetup,
        markdown({ codeLanguages: languages }),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            setContent(newContent);
            setHasUnsavedChanges(true);
            editorState.setHasUnsavedChanges(true);
            
            // Pass content to preview
            props.onContentChange?.(newContent);
            
            // Auto-save after 1 second of no typing
            if (saveTimeout) {
              clearTimeout(saveTimeout);
            }
            saveTimeout = window.setTimeout(() => {
              saveFile();
            }, 1000);
          }
        }),
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            fontSize: `${zoom()}%`,
            height: '100%'
          },
          '.cm-scroller': {
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            lineHeight: '1.6'
          },
          '.cm-content': {
            color: '#e8e8e8'
          },
          '.cm-heading': {
            color: '#ff6b6b'
          }
        })
      ]
    });

    editorView = new EditorView({
      state: startState,
      parent: container
    });
    console.log('Editor initialized');
  };

  createEffect(() => {
    // Initialize editor when file loads
    const initialContent = fileContent();
    
    if (editorContainer && initialContent && !fileContent.loading) {
      setContent(initialContent);
      setHasUnsavedChanges(false);
      editorState.setHasUnsavedChanges(false);
      editorState.setCurrentFilePath(props.filePath);
      initializeEditor(editorContainer, initialContent);
      
      // Pass initial content to preview
      props.onContentChange?.(initialContent);
    }
  });

  createEffect(() => {
    // Update editor font size when zoom changes
    zoom(); // Track dependency
    // Use untrack to get content without creating dependency
    const currentContent = untrack(() => content());
    if (editorView && editorContainer && currentContent) {
      initializeEditor(editorContainer, currentContent);
    }
  });

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
  });

  const saveFile = async () => {
    if (!props.filePath) return;
    
    setIsSaving(true);
    try {
      await invoke('write_file', {
        path: props.filePath,
        contents: content()
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      editorState.setHasUnsavedChanges(false);
      props.onFileSaved?.();
    } catch (error) {
      console.error('Failed to save file:', error);
      alert(`Failed to save: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const shortenPath = (path: string) => {
    return path.replace(/^\/home\/[^/]+\//, '~/');
  };

  return (
    <div class="markdown-editor">
      <Show 
        when={props.filePath}
        fallback={
          <div class="editor-placeholder">
            <div class="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p>Select a file to edit</p>
            </div>
          </div>
        }
      >
        <Show when={fileContent.loading}>
          <div class="editor-loading">Loading...</div>
        </Show>
        <Show when={fileContent.error}>
          <div class="editor-error">
            <h3>Error loading file</h3>
            <p>{fileContent.error instanceof Error ? fileContent.error.message : 'Unknown error'}</p>
          </div>
        </Show>
        <Show when={!fileContent.loading && !fileContent.error}>
          <div class="editor-header">
            <div class="editor-file-path">{shortenPath(props.filePath!)}</div>
            <div class="editor-controls">
              <div class="save-status">
                <Show when={isSaving()}>
                  <span class="saving">Saving...</span>
                </Show>
                <Show when={!isSaving() && lastSaved()}>
                  <span class="saved">Saved at {formatTime(lastSaved()!)}</span>
                </Show>
              </div>
              <button onClick={saveFile} disabled={isSaving() || !hasUnsavedChanges()} class="save-button">
                Save
              </button>
              <div class="zoom-controls">
                <button onClick={zoomOut} title="Zoom out">−</button>
                <button onClick={resetZoom} title="Reset zoom">{zoom()}%</button>
                <button onClick={zoomIn} title="Zoom in">+</button>
              </div>
            </div>
          </div>
          <div 
            ref={editorContainer} 
            class="editor-codemirror"
          />
        </Show>
      </Show>
    </div>
  );
};
