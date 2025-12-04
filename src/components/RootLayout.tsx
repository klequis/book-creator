import { ParentComponent, createSignal } from "solid-js"
import Resizable from "@corvu/resizable"
import { BookTreePanel } from "./BookTreePanel"

export const RootLayout: ParentComponent = (props) => {
  const [sizes, setSizes] = createSignal<number[]>([0.2, 0.8])

  const handleSizesChange = (newSizes: number[]) => {
    setSizes(newSizes)
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Resizable
        orientation="horizontal"
        sizes={sizes()}
        onSizesChange={handleSizesChange}
        style={{ display: "flex", height: "100%", width: "100%" }}
      >
        {/* Left Panel - Tree */}
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
          <BookTreePanel />
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

        {/* Right Panel - Routes */}
        <Resizable.Panel
          initialSize={sizes()[1]}
          minSize={0.2}
          style={{
            overflow: "hidden",
            display: "flex",
            "flex-direction": "column"
          }}
        >
          {props.children}
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}
