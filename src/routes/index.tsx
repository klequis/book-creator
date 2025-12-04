import { createSignal, createEffect } from "solid-js"
import { useSubmission, createAsyncStore } from "@solidjs/router"
import Resizable from "@corvu/resizable"
import { getFileContents, saveFileContents, mockSave } from "~/lib/files"
import { EditorPanel } from "~/components/EditorPanel"
import { BookTreePanel } from "~/components/BookTreePanel"

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

  // Reset local content when file selection changes (not on refetch)
  createEffect(() => {
    const filePath = selectedFilePath()
    if (!filePath) return
    
    // This will trigger when selectedFilePath changes
    // fileData will reactively update via createAsyncStore
  })
  
  // Update localContent when fileData loads successfully
  createEffect(() => {
    const data = fileData()
    if (data.success && !isDirty()) {
      setLocalContent(data.data)
    }
  })

  const handleSizesChange = (newSizes: number[]) => {
    setSizes(newSizes)
  }
  
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

    const result = await saveSub.submit(formData)
    setIsDirty(false)
    
    // Wait for fileData to refetch, then update localContent with saved version
    // This prevents the effect from resetting to old data
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    setIsDirty(true)
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <h1 style={{ padding: "10px", margin: 0, background: "#f0f0f0" }}>
        Home Page (Main Route)
      </h1>
      
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
          <BookTreePanel onFileSelect={(filePath) => setSelectedFilePath(filePath)} />
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
          <EditorPanel
            currentFile={selectedFilePath()}
            content={content()}
            isDirty={isDirty()}
            isSaving={saveSub.pending}
            onContentChange={handleContentChange}
            onSave={handleSave}
          />
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}
