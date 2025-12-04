## 3.5 The Suspense Component

The `<Suspense>` component is required so that asynchronous functions such as fetching data can run without blocking the entire application. When using `<FileRoutes>`, route components are loaded asynchronously so the application is asynchronous by default.

`<Suspense>` can show a fall-back component while the rest of the application is loading. Our application will be small and load so fast that you'll never see the fall-back component, so we will leave it out. See [Suspense](https://docs.solidjs.com/reference/components/suspense) to learn more.

In `root-layout.jsx`:

1. Import `Suspense`.
2. Wrap `props.children` in `<Suspense>`:

{title: "root-layout.jsx"}
```jsx
import { Suspense } from 'solid-js'

export default function RootLayout(props) {
  return <Suspense>{props.children}</Suspense>
}
```

Although we haven't created any routes yet we have completed the minimal configuration of routing and are ready to add routes. Before we move on to do that in the next section, let's dress up our root layout a little so it is visible.

1. Update `root-layout.jsx`:

{title: "root-layout.jsx"}
```jsx
import { Suspense } from 'solid-js'

export default function RootLayout(props) {
  return (
    <main class="component root-layout">
      <div class="filename-lg">
        root-layout.jsx
      </div>
      <Suspense>{props.children}</Suspense>
    </main>
  )
}
```

You project should now be running without error and look like this:

![application with root layout](resources/routing-set-root-layout.png)
