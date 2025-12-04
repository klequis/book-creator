## 3.4 Reducing Repetitive Code

We will be creating many routes and don't want to have a lot of code duplication. Toward that goal, let's create a new component to contain the file and route details that are common to all of our route components.

{aside}
*Primitives* in Solid are functions that serve as the building blocks of reactivity and behavior. Their names usually begin with `create` or `use`. Although some primitives have a name that starts with `use`, they are not the same as React hooks. Some primitives are built into Solid and others are available on the [SOLID Primitives](https://primitives.solidjs.community) website. 
{/aside}

The [`useLocation`](https://docs.solidjs.com/solid-router/reference/primitives/use-location#uselocation) primitive, which is similar to `window.location`, can give use the the current route.

1. Create `src/file-details.jsx`:

{title: "src/file-details.jsx"}
```jsx
import { useLocation } from "@solidjs/router";

export default function FileDetails(props) {
  const location = useLocation();
  return (
    <>
      <div class="filename">
        <div>file:</div>
        <code>{props.file}</code>
      </div>
      <div class="filename">
        route: <code>{location.pathname}</code>
      </div>
    </>
  )
}
```

3. Replace the code in `routes/index.jsx`:

{title: "routes/index.jsx"}
```jsx
import FileDetails from "~/file-details";

export default function Index() {
  return (
    <div class="component">
      <FileDetails file="routes/index.jsx" />
    </div>
  )
}
```

We didn't move `<div class="component">` to `file-details` as some of our components will have additional code added within that `div`.
