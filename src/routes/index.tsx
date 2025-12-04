import { Title } from "@solidjs/meta"
import { createSignal, For, Show, Suspense, Switch, Match } from "solid-js"
import { createAsyncStore, useSubmission } from "@solidjs/router"
import { getDirectoryContents, getFileContents, saveFileContents, type FileEntry } from "~/lib/files"

type ExpandedDirs = Record<string, boolean>

export default function Home() {
  // Load root directory using createAsyncStore
  const rootFiles = createAsyncStore(() => getDirectoryContents("."), {
    initialValue: { success: true, data: [] as FileEntry[], error: null }
  })

  const [expandedDirs, setExpandedDirs] = createSignal<ExpandedDirs>({})
  const [dirContents, setDirContents] = createSignal<Record<string, any>>({})
  const [currentFile, setCurrentFile] = createSignal<string | null>(null)
  const [content, setContent] = createSignal("")
  const [isDirty, setIsDirty] = createSignal(false)

  // Track save submission
  const saveSub = useSubmission(saveFileContents)

  const toggleDirectory = async (dir: FileEntry) => {
    const isExpanded = expandedDirs()[dir.path]
    
    if (!isExpanded) {
      // Load directory contents using createAsyncStore
      const dirStore = createAsyncStore(() => getDirectoryContents(dir.path), {
        initialValue: { success: true, data: [] as FileEntry[], error: null }
      })
      setDirContents(prev => ({ ...prev, [dir.path]: dirStore }))
      setExpandedDirs(prev => ({ ...prev, [dir.path]: true }))
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
      const result = await getFileContents(file.path)
      if (result.success) {
        setContent(result.data)
        setCurrentFile(file.path)
        setIsDirty(false)
      } else {
        console.error("Failed to read file:", result.error)
      }
    } catch (err) {
      console.error("Failed to read file:", err)
    }
  }

  const handleSave = async (e: Event) => {
    e.preventDefault()
    if (!currentFile()) return

    const formData = new FormData()
    formData.append("filePath", currentFile()!)
    formData.append("content", content())

    const result = await saveFileContents(formData)
    if (result.success) {
      setIsDirty(false)
    } else {
      console.error("Failed to save file:", result.errors)
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
              <Suspense fallback={<div style={{"padding-left": `${25 + level * 15}px`, color: "#999"}}>Loading...</div>}>
                <Switch>
                  <Match when={dirContents()[file.path]?.()?.success}>
                    {renderFileTree(dirContents()[file.path]?.()?.data || [], level + 1)}
                  </Match>
                  <Match when={dirContents()[file.path]?.()?.error}>
                    <div style={{"padding-left": `${25 + level * 15}px`, color: "#ff6b6b"}}>
                      Error: {dirContents()[file.path]?.()?.error}
                    </div>
                  </Match>
                </Switch>
              </Suspense>
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
        <Suspense fallback={<div style={{ color: "#999" }}>Loading files...</div>}>
          <Switch>
            <Match when={rootFiles().success}>
              {renderFileTree(rootFiles().data)}
            </Match>
            <Match when={rootFiles().error}>
              <div style={{ color: "#ff6b6b" }}>
                Error: {rootFiles().error}
              </div>
            </Match>
          </Switch>
        </Suspense>
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
              <Show when={saveSub.pending}>
                <span style={{ "margin-left": "10px", color: "#4CAF50" }}>
                  💾 Saving...
                </span>
              </Show>
            </Show>
            <Show when={!currentFile()}>
              <span style={{ color: "#999" }}>No file selected</span>
            </Show>
          </div>
          <button
            onClick={handleSave}
            disabled={!currentFile() || !isDirty() || saveSub.pending}
            style={{
              padding: "5px 15px",
              cursor: currentFile() && isDirty() && !saveSub.pending ? "pointer" : "not-allowed",
              opacity: currentFile() && isDirty() && !saveSub.pending ? 1 : 0.5
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
