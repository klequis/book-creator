import { createSignal, onMount, Show } from 'solid-js';
import Resizable from '@corvu/resizable';
import { TreeView } from "./components/TreeView";
import { MarkdownPreview } from "./components/MarkdownPreview";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { NotificationContainer } from "./components/NotificationContainer";
import { ErrorPanel } from "./components/ErrorPanel";
import { getIsErrorPanelOpen } from "./stores/errorStore";
import { restoreWindowState, setupWindowStateListeners } from "./utils/windowManager";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = createSignal<string | null>(null);
  const [treeZoom, setTreeZoom] = createSignal(180);
  const [resourcesPath, setResourcesPath] = createSignal<string | null>(null);
  const [editorContent, setEditorContent] = createSignal<string | null>(null);
  
  const isErrorPanelOpen = getIsErrorPanelOpen;
  
  // Persistent panel sizes - now 4 panels when error panel is open
  // [sidebar, editor, preview, errorPanel]
  const [panelSizes, setPanelSizes] = createSignal<number[]>([0.2, 0.35, 0.35, 0.1]);

  onMount(() => {
    restoreWindowState();
    setupWindowStateListeners();
    
    // Load saved panel sizes
    const saved = localStorage.getItem('panel-sizes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          setPanelSizes(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved panel sizes', e);
      }
    }
  });

  // Save panel sizes when they change
  const handleSizesChange = (sizes: number[]) => {
    setPanelSizes(sizes);
    localStorage.setItem('panel-sizes', JSON.stringify(sizes));
  };

  return (
    <div class="app">
      <NotificationContainer />
      <Resizable 
        sizes={panelSizes()} 
        onSizesChange={handleSizesChange}
        class="app-layout"
      >
        <Resizable.Panel 
          initialSize={panelSizes()[0]} 
          minSize={0.15} 
          maxSize={0.4}
          class="sidebar-panel"
        >
          <TreeView 
            onFileSelect={setSelectedFile} 
            onZoomChange={setTreeZoom} 
            onResourcesPathChange={setResourcesPath} 
          />
        </Resizable.Panel>
        
        <Resizable.Handle class="resize-handle" aria-label="Resize sidebar" />
        
        <Resizable.Panel 
          initialSize={panelSizes()[1]} 
          minSize={0.2}
          class="editor-panel"
        >
          <MarkdownEditor 
            filePath={selectedFile()} 
            resourcesPath={resourcesPath()} 
            onContentChange={setEditorContent}
          />
        </Resizable.Panel>
        
        <Resizable.Handle class="resize-handle" aria-label="Resize editor" />
        
        <Resizable.Panel 
          initialSize={panelSizes()[2]} 
          minSize={0.2}
          class="preview-panel"
        >
          <MarkdownPreview 
            filePath={selectedFile()} 
            resourcesPath={resourcesPath()} 
            content={editorContent()} 
          />
        </Resizable.Panel>
        
        <Show when={isErrorPanelOpen()}>
          <Resizable.Handle class="resize-handle" aria-label="Resize preview" />
          
          <Resizable.Panel 
            initialSize={panelSizes()[3]} 
            minSize={0.1}
            maxSize={0.5}
            class="error-panel-container"
          >
            <ErrorPanel />
          </Resizable.Panel>
        </Show>
      </Resizable>
    </div>
  );
}

export default App;
