import { createSignal, Show } from "solid-js"
import { Title } from "@solidjs/meta"
import { useSubmission, createAsyncStore } from "@solidjs/router"
import Resizable from "@corvu/resizable"
import { getFileContents, saveFileContents } from "~/lib/files"
import { BookTreePanel } from "~/components/BookTreePanel"
import { EditorPanel } from "~/components/EditorPanel"

export default function Home() {
  const [sizes, setSizes] = createSignal<number[]>([0.2, 0.8])
  const [selectedFilePath, setSelectedFilePath] = createSignal<string | null>(null)
  const [isDirty, setIsDirty] = createSignal(false)
  const [localContent, setLocalContent] = createSignal("")
  
  // Query for file contents - auto-refetches after save
  const fileData = createAsyncStore(async () => {
    const filePath = selectedFilePath()
    if (!filePath) return { success: false, data: "", error: null }
    return await getFileContents(filePath)
  }, {
    initialValue: { success: false, data: "", error: null }
  })
  
  const saveSub = useSubmission(saveFileContents)

  const handleSizesChange = (newSizes: number[]) => {
    console.log("Sizes changed:", newSizes)
    setSizes(newSizes)
  }
  
  const handleFileSelect = (filePath: string) => {
    if (isDirty()) {
      const confirm = window.confirm("You have unsaved changes. Continue?")
      if (!confirm) return
    }

    setSelectedFilePath(filePath)
    setIsDirty(false)
  }
  
  // Update local content when file data loads
  const content = () => {
    if (fileData().success && !isDirty()) {
      return fileData().data
    }
    return localContent()
  }

  const handleSave = async () => {
    if (!selectedFilePath()) return

    const formData = new FormData()
    formData.append("filePath", selectedFilePath()!)
    formData.append("content", localContent())

    await saveFileContents(formData)
    setIsDirty(false)
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    setIsDirty(true)
  }

  return (
    <main style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Title>Book Creator</Title>
      
      <div style={{ padding: "10px", background: "#f0f0f0", display: "flex", gap: "20px", "align-items": "center" }}>
        <h1 style={{ margin: 0 }}>Home Page (Main Route)</h1>
        <nav style={{ display: "flex", gap: "10px" }}>
          <a href="/" style={{ padding: "5px 10px", background: "#007acc", color: "white", "text-decoration": "none", "border-radius": "4px" }}>Home</a>
          <a href="/test-resizable" style={{ padding: "5px 10px", background: "#007acc", color: "white", "text-decoration": "none", "border-radius": "4px" }}>Test Page</a>
        </nav>
      </div>
      
      <Resizable
        orientation="horizontal"
        sizes={sizes()}
        onSizesChange={handleSizesChange}
        style={{ display: "flex", height: "calc(100vh - 60px)", width: "100%" }}
      >
        {/* Book Tree Panel */}
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
          {/* <BookTreePanel onFileSelect={handleFileSelect} /> */}
          <h1>Book Tree Panel</h1>
        </Resizable.Panel>

        {/* Handle */}
        <Resizable.Handle
          aria-label="Resize panels"
          style={{
            position: "relative",
            width: "8px",
            background: "#ddd",
            cursor: "col-resize",
            "flex-shrink": 0
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
          {/* <EditorPanel
            currentFile={selectedFilePath()}
            content={content()}
            isDirty={isDirty()}
            isSaving={saveSub.pending ?? false}
            onContentChange={handleContentChange}
            onSave={handleSave}
          /> */}
          <h1>Editor Panel</h1>
        </Resizable.Panel>
      </Resizable>
    </main>
  )
}
