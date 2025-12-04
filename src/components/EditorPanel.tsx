import { Component, Show } from "solid-js"

interface EditorPanelProps {
  currentFile: string | null
  content: string
  isDirty: boolean
  isSaving: boolean
  onContentChange: (content: string) => void
  onSave: () => void
}

export const EditorPanel: Component<EditorPanelProps> = (props) => {
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
          <Show when={props.currentFile}>
            <span>{props.currentFile}</span>
            <Show when={props.isDirty}>
              <span style={{ "margin-left": "10px", color: "#ff6b6b" }}>
                ● Modified
              </span>
            </Show>
            <Show when={props.isSaving}>
              <span style={{ "margin-left": "10px", color: "#4CAF50" }}>
                💾 Saving...
              </span>
            </Show>
          </Show>
          <Show when={!props.currentFile}>
            <span style={{ color: "#999" }}>No file selected</span>
          </Show>
        </div>
        <button
          onClick={props.onSave}
          disabled={!props.currentFile || !props.isDirty || props.isSaving}
          style={{
            padding: "5px 15px",
            cursor: props.currentFile && props.isDirty && !props.isSaving ? "pointer" : "not-allowed",
            opacity: props.currentFile && props.isDirty && !props.isSaving ? 1 : 0.5
          }}
        >
          Save
        </button>
      </div>

      <textarea
        value={props.content}
        onInput={(e) => props.onContentChange(e.currentTarget.value)}
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
