import { createSignal } from "solid-js"
import Resizable from "@corvu/resizable"

export default function TestResizable() {
  const [sizes, setSizes] = createSignal<number[]>([0.25, 0.5, 0.25])

  const handleSizesChange = (newSizes: number[]) => {
    console.log("Sizes changed:", newSizes)
    setSizes(newSizes)
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <h1 style={{ padding: "10px", margin: 0, background: "#f0f0f0" }}>
        Test Resizable Panes
      </h1>
      
      <Resizable
        orientation="horizontal"
        sizes={sizes()}
        onSizesChange={handleSizesChange}
        style={{ display: "flex", height: "calc(100vh - 60px)", width: "100%" }}
      >
        {/* Panel 1 */}
        <Resizable.Panel
          initialSize={sizes()[0]}
          minSize={0.15}
          maxSize={0.5}
          style={{
            overflow: "hidden",
            display: "flex",
            "flex-direction": "column",
            background: "#ffebee",
            padding: "20px"
          }}
        >
          <h2>Panel 1</h2>
          <p>This is the first panel.</p>
          <p>Size: {(sizes()[0] * 100).toFixed(1)}%</p>
        </Resizable.Panel>

        {/* Handle 1 */}
        <Resizable.Handle
          aria-label="Resize panel 1"
          style={{
            position: "relative",
            width: "8px",
            background: "#666",
            cursor: "col-resize",
            "flex-shrink": 0
          }}
        />

        {/* Panel 2 */}
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
          <h2>Panel 2</h2>
          <p>This is the second panel (middle).</p>
          <p>Size: {(sizes()[1] * 100).toFixed(1)}%</p>
        </Resizable.Panel>

        {/* Handle 2 */}
        <Resizable.Handle
          aria-label="Resize panel 2"
          style={{
            position: "relative",
            width: "8px",
            background: "#666",
            cursor: "col-resize",
            "flex-shrink": 0
          }}
        />

        {/* Panel 3 */}
        <Resizable.Panel
          initialSize={sizes()[2]}
          minSize={0.15}
          maxSize={0.5}
          style={{
            overflow: "hidden",
            display: "flex",
            "flex-direction": "column",
            background: "#f1f8e9",
            padding: "20px"
          }}
        >
          <h2>Panel 3</h2>
          <p>This is the third panel.</p>
          <p>Size: {(sizes()[2] * 100).toFixed(1)}%</p>
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}
