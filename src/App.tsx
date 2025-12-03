import { createSignal, onMount } from 'solid-js';
import Resizable from '@corvu/resizable';
import { TreeView } from "./components/TreeView";
import { MarkdownPreview } from "./components/MarkdownPreview";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { NotificationContainer } from "./components/NotificationContainer";
import { restoreWindowState, setupWindowStateListeners } from "./utils/windowManager";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = createSignal<string | null>(null);
  const [treeZoom, setTreeZoom] = createSignal(180);
  const [resourcesPath, setResourcesPath] = createSignal<string | null>(null);
  const [editorContent, setEditorContent] = createSignal<string | null>(null);
  
  // Persistent panel sizes (sidebar 20%, editor 40%, preview 40%)
  const [panelSizes, setPanelSizes] = createSignal<number[]>([0.2, 0.4, 0.4]);

  onMount(() => {
    restoreWindowState();
    setupWindowStateListeners();
    
    // Load saved panel sizes
    const saved = localStorage.getItem('panel-sizes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
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
      </Resizable>
    </div>
  );
}

export default App;
