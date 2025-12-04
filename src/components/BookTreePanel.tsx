import { Component, Suspense, Switch, Match } from "solid-js"
import { createAsyncStore } from "@solidjs/router"
import { loadBookStructure } from "~/stores/bookStore"
import { BookProvider } from "~/contexts/BookContext"
import { BookTree } from "./BookTree"

interface BookTreePanelProps {
  onFileSelect: (filePath: string) => void
}

export const BookTreePanel: Component<BookTreePanelProps> = (props) => {
  const bookData = createAsyncStore(() => loadBookStructure(), {
    initialValue: { success: false, error: "" }
  })

  return (
    <>
      <h3 style={{ margin: "0 0 10px 0" }}>Book Structure</h3>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Suspense fallback={<div style={{ color: "#999" }}>Loading book...</div>}>
          <Switch>
            <Match when={bookData().success && bookData().book}>
              <BookProvider 
                book={bookData().book!}
                rootPath={bookData().rootPath!}
                onFileSelect={props.onFileSelect}
              >
                <BookTree />
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
    </>
  )
}
