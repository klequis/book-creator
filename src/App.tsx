import { createSignal } from 'solid-js';
import { TreeView } from "./components/TreeView";
import { MarkdownPreview } from "./components/MarkdownPreview";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = createSignal<string | null>(null);

  return (
    <div class="app">
      <div class="app-layout">
        <div class="sidebar">
          <TreeView onFileSelect={setSelectedFile} />
        </div>
        <div class="main-content">
          <MarkdownPreview filePath={selectedFile()} />
        </div>
      </div>
    </div>
  );
}

export default App;
