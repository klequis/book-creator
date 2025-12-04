import { Title } from "@solidjs/meta"
import { createSignal, Show, Suspense, Switch, Match } from "solid-js"
import { createAsyncStore, useSubmission } from "@solidjs/router"
import Resizable from "@corvu/resizable"
import { getFileContents, saveFileContents } from "~/lib/files"
import { loadBookStructure } from "~/stores/bookStore"
import { Book } from "~/components/Book"
import { BookProvider } from "~/contexts/BookContext"

export default function Home() {
  // Load book structure
  const bookData = createAsyncStore(() => loadBookStructure(), {
    initialValue: { success: false, error: "" }
  })

  const [currentFile, setCurrentFile] = createSignal<string | null>(null)
  const [content, setContent] = createSignal("")
  const [isDirty, setIsDirty] = createSignal(false)
  
  // Track panel sizes for debugging
  const [sizes, setSizes] = createSignal<number[]>([0.2, 0.8])
  
  const handleSizesChange = (newSizes: number[]) => {
    console.log("Panel sizes changed:", newSizes)
    setSizes(newSizes)
  }

  // Track save submission
  const saveSub = useSubmission(saveFileContents)

  const handleFileSelect = async (filePath: string) => {
    if (isDirty()) {
      const confirm = window.confirm("You have unsaved changes. Continue?")
      if (!confirm) return
    }

    try {
      const result = await getFileContents(filePath)
      if (result.success) {
        setContent(result.data)
        setCurrentFile(filePath)
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

  return (
    <main style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Title>Book Creator</Title>
      
      <div style={{ padding: "10px", background: "#f0f0f0", "border-bottom": "1px solid #ccc" }}>
        <a href="/test-resizable" style={{ "margin-right": "20px" }}>Test Resizable</a>
        <a href="/">Home</a>
      </div>

      <Resizable 
        orientation="horizontal" 
        sizes={sizes()}
        onSizesChange={handleSizesChange}
        style={{ display: "flex", height: "calc(100vh - 45px)", width: "100%" }}
      >
          {/* File Tree Panel */}
          <Resizable.Panel 
            initialSize={sizes()[0]} 
            minSize={0.15} 
            maxSize={0.4}
            style={{
              overflow: "hidden",
              display: "flex",
              "flex-direction": "column",
              "border-right": "1px solid #ccc",
              padding: "10px"
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Book Structure</h3>
            <div style={{ flex: 1, overflow: "auto" }}>
              <Suspense fallback={<div style={{ color: "#999" }}>Loading book...</div>}>
                <Switch>
                  <Match when={bookData().success && bookData().book}>
                    <BookProvider 
                      book={bookData().book!}
                      rootPath={bookData().rootPath!}
                      onFileSelect={handleFileSelect}
                    >
                      <Book />
                    </BookProvider>
                  </Match>
                  <Match when={bookData().error}>
                    <div style={{ color: "#ff6b6b" }}>
                      Error: {bookData().error}
                    </div>
                  </Match>
                </Switch>
              </Suspense>
            </div>
          </Resizable.Panel>

          {/* Resize Handle */}
          <Resizable.Handle 
            aria-label="Resize panels"
            style={{
              position: "relative",
              width: "8px",
              background: "#ddd",
              cursor: "col-resize",
              transition: "background-color 0.15s ease",
              "flex-shrink": 0,
              "z-index": 10
            }}
          />

          {/* Editor Panel */}
          <Resizable.Panel 
            initialSize={sizes()[1]}
            minSize={0.2}
            style={{ 
              overflow: "hidden",
              display: "flex", 
              "flex-direction": "column" 
            }}
          >
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
          </Resizable.Panel>
        </Resizable>
    </main>
  )
}
