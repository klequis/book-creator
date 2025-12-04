import { createSignal, Suspense, Switch, Match, For } from "solid-js"
import { createAsyncStore } from "@solidjs/router"
import Resizable from "@corvu/resizable"
import { loadBookStructure } from "~/stores/bookStore"
import { BookProvider } from "~/contexts/BookContext"

export default function TestResizable() {
  const [sizes, setSizes] = createSignal<number[]>([0.2, 0.8])
  
  // Load book structure
  const bookData = createAsyncStore(() => loadBookStructure(), {
    initialValue: { success: false, error: "" }
  })

  const handleSizesChange = (newSizes: number[]) => {
    console.log("Sizes changed:", newSizes)
    setSizes(newSizes)
  }
  
  const handleFileSelect = (filePath: string) => {
    console.log("File selected:", filePath)
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
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
        {/* Panel 1 - Book Tree Placeholder */}
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
                    <div>
                      <For each={bookData().book!.chapters}>
                        {(chapter) => (
                          <div style={{ padding: "5px" }}>
                            Chapter {chapter.chapterNumber} - {chapter.sections.length} sections
                          </div>
                        )}
                      </For>
                    </div>
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

        {/* Panel 2 - Editor Placeholder */}
        <Resizable.Panel
          initialSize={sizes()[1]}
          minSize={0.2}
          style={{
            overflow: "hidden",
            display: "flex",
            "flex-direction": "column",
            background: "#e3f2fd",
            padding: "20px"
          }}
        >
          <h2>Editor Panel</h2>
          <p>Editor will go here</p>
          <p>Size: {(sizes()[1] * 100).toFixed(1)}%</p>
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}
