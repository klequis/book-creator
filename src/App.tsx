import { createSignal, onMount } from 'solid-js';
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

  onMount(() => {
    restoreWindowState();
    setupWindowStateListeners();
  });

  // Calculate sidebar width based on zoom (base 300px at 100%)
  const sidebarWidth = () => Math.round((300 * treeZoom()) / 100);

  return (
    <div class="app">
      <NotificationContainer />
      <div class="app-layout">
        <div class="sidebar" style={{ width: `${sidebarWidth()}px` }}>
          <TreeView onFileSelect={setSelectedFile} onZoomChange={setTreeZoom} onResourcesPathChange={setResourcesPath} />
        </div>
        <div class="main-content">
          <div class="editor-pane">
            <MarkdownEditor 
              filePath={selectedFile()} 
              resourcesPath={resourcesPath()} 
              onContentChange={setEditorContent}
            />
          </div>
          <div class="preview-pane">
            <MarkdownPreview 
              filePath={selectedFile()} 
              resourcesPath={resourcesPath()} 
              content={editorContent()} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
