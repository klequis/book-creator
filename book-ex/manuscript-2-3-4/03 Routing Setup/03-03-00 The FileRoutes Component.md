## 3.3 The FileRoutes Component

SolidStart reads the file system under your project's `/routes` directory and `<FileRoutes>` makes the results available to the `<Router>` component as an array of route objects. We will take a look at the route objects at the end of this chapter.

1. Import `FileRoutes` from `@solidjs/start/router`.
2. Wrap `<FileRoutes>` in `<Router>`:

{title: "app.jsx"}

```jsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import './app.css'

export default function App() {
  return (
    <div class="app">
      <div class="filename-lg">
        app.jsx
      </div>
      <Router>
        <FileRoutes />
      </Router>
    </div>
  )
}
```