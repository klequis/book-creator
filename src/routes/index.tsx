import { Title } from "@solidjs/meta"
import { createSignal, For, Show } from "solid-js"
import { readDir, readFile, writeFile } from "~/lib/files"

type FileEntry = {
  name: string
  isDirectory: boolean
  path: string
}

type ExpandedDirs = Record<string, boolean>

export default function Home() {
  const [files, setFiles] = createSignal<FileEntry[]>([])
  const [expandedDirs, setExpandedDirs] = createSignal<ExpandedDirs>({})
  const [dirContents, setDirContents] = createSignal<Record<string, FileEntry[]>>({})
  const [currentFile, setCurrentFile] = createSignal<string | null>(null)
  const [content, setContent] = createSignal("")
  const [isDirty, setIsDirty] = createSignal(false)

  // Load root directory on mount
  const loadFiles = async () => {
    try {
      const entries = await readDir(".")
      setFiles(entries)
    } catch (err) {
      console.error("Failed to load files:", err)
    }
  }

  loadFiles()

  const toggleDirectory = async (dir: FileEntry) => {
    const isExpanded = expandedDirs()[dir.path]
    
    if (!isExpanded) {
      // Load directory contents
      try {
        const entries = await readDir(dir.path)
        setDirContents(prev => ({ ...prev, [dir.path]: entries }))
        setExpandedDirs(prev => ({ ...prev, [dir.path]: true }))
      } catch (err) {
        console.error("Failed to load directory:", err)
      }
    } else {
      // Collapse directory
      setExpandedDirs(prev => ({ ...prev, [dir.path]: false }))
    }
  }

  const handleFileClick = async (file: FileEntry) => {
    if (file.isDirectory) {
      await toggleDirectory(file)
      return
    }

    if (isDirty()) {
      const confirm = window.confirm("You have unsaved changes. Continue?")
      if (!confirm) return
    }

    try {
      const fileContent = await readFile(file.path)
      setContent(fileContent)
      setCurrentFile(file.path)
      setIsDirty(false)
    } catch (err) {
      console.error("Failed to read file:", err)
    }
  }

  const handleSave = async () => {
    if (!currentFile()) return

    try {
      await writeFile(currentFile()!, content())
      setIsDirty(false)
    } catch (err) {
      console.error("Failed to save file:", err)
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setIsDirty(true)
  }

  const renderFileTree = (entries: FileEntry[], level = 0) => {
    return (
      <For each={entries}>
        {file => (
          <>
            <div
              style={{
                padding: "5px",
                "padding-left": `${10 + level * 15}px`,
                cursor: "pointer",
                "background-color":
                  currentFile() === file.path ? "#e0e0e0" : "transparent",
                "border-radius": "3px"
              }}
              onClick={() => handleFileClick(file)}
            >
              {file.isDirectory ? (
                expandedDirs()[file.path] ? "📂" : "📁"
              ) : "📄"}{" "}
              {file.name}
            </div>
            <Show when={file.isDirectory && expandedDirs()[file.path]}>
              {renderFileTree(dirContents()[file.path] || [], level + 1)}
            </Show>
          </>
        )}
      </For>
    )
  }

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <Title>Book Creator</Title>

      {/* File Tree */}
      <div
        style={{
          width: "250px",
          "border-right": "1px solid #ccc",
          padding: "10px",
          overflow: "auto"
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Files</h3>
        {renderFileTree(files())}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, display: "flex", "flex-direction": "column" }}>
        <div
          style={{
            padding: "10px",
            "border-bottom": "1px solid #ccc",
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center"
          }}
        >
          <div>
            <Show when={currentFile()}>
              <span>{currentFile()}</span>
              <Show when={isDirty()}>
                <span style={{ "margin-left": "10px", color: "#ff6b6b" }}>
                  ● Modified
                </span>
              </Show>
            </Show>
            <Show when={!currentFile()}>
              <span style={{ color: "#999" }}>No file selected</span>
            </Show>
          </div>
          <button
            onClick={handleSave}
            disabled={!currentFile() || !isDirty()}
            style={{
              padding: "5px 15px",
              cursor: currentFile() && isDirty() ? "pointer" : "not-allowed",
              opacity: currentFile() && isDirty() ? 1 : 0.5
            }}
          >
            Save
          </button>
        </div>

        <textarea
          value={content()}
          onInput={e => handleContentChange(e.currentTarget.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            outline: "none",
            resize: "none",
            "font-family": "monospace",
            "font-size": "14px"
          }}
          placeholder="Select a file to edit..."
        />
      </div>
    </main>
  )
}
