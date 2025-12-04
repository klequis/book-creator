import { createSignal, createEffect, Show } from "solid-js"
import { useParams, useSubmission, createAsync } from "@solidjs/router"
import { getFileContents, saveFileContents } from "~/lib/files"

export default function EditFile() {
  const params = useParams<{ filePath: string }>()
  const [isDirty, setIsDirty] = createSignal(false)
  const [localContent, setLocalContent] = createSignal("")
  
  // Load file contents reactively based on route param
  const fileData = createAsync(async () => {
    const filePath = decodeURIComponent(params.filePath)
    if (!filePath) return { success: false, data: "", error: null }
    return await getFileContents(filePath)
  })
  
  const saveSub = useSubmission(saveFileContents)

  // Update localContent when fileData loads successfully
  createEffect(() => {
    const data = fileData()
    if (data?.success && !isDirty()) {
      setLocalContent(data.data)
    }
  })

  const content = () => {
    const data = fileData()
    if (data?.success && !isDirty()) {
      return data.data
    }
    return localContent()
  }

  const handleSave = async () => {
    const filePath = decodeURIComponent(params.filePath)
    if (!filePath) return

    const formData = new FormData()
    formData.append("filePath", filePath)
    formData.append("content", localContent())

    await saveSub.submit(formData)
    setIsDirty(false)
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    setIsDirty(true)
  }

  return (
    <>
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
          <Show when={params.filePath}>
            <span>{decodeURIComponent(params.filePath)}</span>
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
        </div>
        <button
          onClick={handleSave}
          disabled={!params.filePath || !isDirty() || saveSub.pending}
          style={{
            padding: "5px 15px",
            cursor: params.filePath && isDirty() && !saveSub.pending ? "pointer" : "not-allowed",
            opacity: params.filePath && isDirty() && !saveSub.pending ? 1 : 0.5
          }}
        >
          Save
        </button>
      </div>

      <textarea
        value={content()}
        onInput={(e) => handleContentChange(e.currentTarget.value)}
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
    </>
  )
}
