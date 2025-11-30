import { createSignal } from 'solid-js';
import { TreeView } from "./components/TreeView";
import { MarkdownPreview } from "./components/MarkdownPreview";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = createSignal<string | null>(null);
  const [treeZoom, setTreeZoom] = createSignal(180);

  // Calculate sidebar width based on zoom (base 300px at 100%)
  const sidebarWidth = () => Math.round((300 * treeZoom()) / 100);

  return (
    <div class="app">
      <div class="app-layout">
        <div class="sidebar" style={{ width: `${sidebarWidth()}px` }}>
          <TreeView onFileSelect={setSelectedFile} onZoomChange={setTreeZoom} />
        </div>
        <div class="main-content">
          <MarkdownPreview filePath={selectedFile()} />
        </div>
      </div>
    </div>
  );
}

export default App;
