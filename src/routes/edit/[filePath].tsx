import { createSignal, createMemo, createEffect, Show } from "solid-js";
import {
  useParams,
  useSubmission,
  createAsyncStore,
} from "@solidjs/router";
import { getFileContents, saveFileContents } from "~/lib/files";

export default function EditFile() {
  const params = useParams();
  const [localContent, setLocalContent] = createSignal("");
  const [hasEdited, setHasEdited] = createSignal(false);

  const filepath = decodeURIComponent(params.filepath || "");

  let formRef!: HTMLFormElement;
  let pendingNavigation: (() => void) | null = null;

  // Load file contents reactively based on route param
  const fileData = createAsyncStore(
    () => {
      if (!filepath)
        return Promise.resolve({ success: false, data: "", error: null });
      return getFileContents(filepath);
    },
    { initialValue: { success: false, data: "", error: null } }
  );

  const saveSub = useSubmission(saveFileContents);

  // Clear state after successful save and retry pending navigation
  createEffect(() => {
    console.log("filepath:", filepath);
  });

  // Derive isDirty by comparing current content to server data
  const isDirty = createMemo(() => {
    if (!hasEdited()) return false;
    const serverData = fileData()?.data || "";
    return localContent() !== serverData;
  });

  const handleSubmit = (e: SubmitEvent) => {
    console.log("=== handleSubmit ===");
    console.log("isDirty:", isDirty());

    // Prevent submission if no changes
    if (!isDirty()) {
      console.log("Preventing submit - not dirty");
      e.preventDefault();
    } else {
      console.log("Allowing submit - form will submit");
    }
  };

  const content = () => {
    // Show server data if we haven't started editing yet
    if (localContent() === "") {
      return fileData()?.data || "";
    }
    return localContent();
  };

  return (
    <>
    <h1>[filePath]</h1>
      <div id="inner-div">
        <Show when={filepath}>
          <span style="font-weight: bold;font-size: 20px;">{filepath()}</span>
          <Show when={saveSub.pending}>
            <span
              style={{
                "margin-left": "10px",
                color: "#4CAF50",
                "font-weight": "bold",
              }}
            >
              💾 Saving...
            </span>
          </Show>
          <Show when={isDirty() && !saveSub.pending}>
            <span style={{ "margin-left": "10px", color: "#ff6b6b" }}>
              ● Modified
            </span>
          </Show>
        </Show>
      </div>
      <form
        ref={formRef}
        action={saveFileContents}
        method="post"
        // onSubmit={handleSubmit}
        style={{ display: "flex", "flex-direction": "column", height: "100%" }}
      >
        <input
          type="hidden"
          name="filePath"
          value={filepath}
        />
        <div
          id="outer-div"
          style={{
            padding: "10px",
            "border-bottom": "1px solid #ccc",
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
          }}
        >
          <button
            type="submit"
            disabled={!filepath || !isDirty() || saveSub.pending}
            style={{
              padding: "5px 15px",
              cursor:
                filepath && isDirty() && !saveSub.pending
                  ? "pointer"
                  : "not-allowed",
              opacity:
                filepath && isDirty() && !saveSub.pending ? 1 : 0.5,
            }}
          >
            Save
          </button>
        </div>

        <textarea
          name="content"
          value={content()}
          onInput={(e) => {
            setLocalContent(e.currentTarget.value);
            setHasEdited(true);
          }}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            outline: "none",
            resize: "none",
            "font-family": "monospace",
            "font-size": "14px",
          }}
          placeholder="Select a file to edit..."
        />
      </form>
    </>
  );
}
