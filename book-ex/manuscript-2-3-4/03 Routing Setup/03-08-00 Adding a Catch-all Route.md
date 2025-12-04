## 3.8 Adding a Catch-all Route

A catch-all route is a route that matches any URL path that doesn't match any of the defined routes. You can think of it like the `default` clause of a JavaScript `switch` statement. It is often, but not exclusively, used to display a "page not found" page.

Catch-all routes are a type of dynamic route. Their dynamic nature will be covered in the chapter *Dynamic Routes*. We are adding it now so that if you miss-type a route you will get the "not found" page to indicate that.

You create a catch-all route with the syntax `[...]`. Optionally, you can add a name after `...` as in `[...anystring]`. The name will be a parameter that can be used in code. Parameters will be discussed in the chapter *Dynamic Routes*.

1. Create `routes/[...notfound].jsx`:

{title: "routes/[...notfound].jsx"}
```jsx
import FileDetails from "~/file-details.jsx"

export default function NotFound() {
  return (
    <div class="component">
      <FileDetails file="routes/[...notfound].jsx" />
    </div>
  )
}
```

To test our catch-all route, enter any path in the URL that does not match an existing route. For example, try `/coffee`:

![Path of /coffee navigates to page not found](resources/add-catch-all-coffee-invalid.png)
