## 4.3 Multiple Routes in a Single Directory

You can create multiple routes in a given directory. Let's demonstrate that with two new routes: `/products/categories/mice` and `/products/categories/keyboards`.

1. Create `/products/categories`.
3. Create `/categories/mice.jsx`:

{title: "mice.jsx`"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function Mice() {
  return (
    <div class="component">
      <FileDetails 
        file="routes/products/categories/mice.jsx" 
      />
    </div>
  )
}
```

3. Create `/categories/keyboards.jsx`:

{title: "keyboards.jsx"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function Keyboards() {
  return (
    <div class="component">
      <FileDetails 
        file="routes/products/categories/keyboards.jsx" 
      />
    </div>
  )
}
```

Now try all three paths in the URL
- `/products/categories`
- `/products/categories/mice`
- `/products/categories/keyboards`

What have we learned?
- The *index* route is also called the *root* route and has a path of `/`.
- Files named `index` can contain components which are rendered on the page but do not create additional route segments.
- Both directories and named files can create route segments.