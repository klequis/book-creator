## 4.2 A Directory as a Route Segment

With the route `/contacts` the "contacts" segment of the URL was created by the named file `contacts.jsx`. You can also create route segments with a directory. However, you still need a file that exports a component in the directory. Our example for this will be a `/products` route that uses an `index` file for the component.

1. Create `routes/products`.
2. Create `products/index.jsx`:

{title: "products/index.jsx"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function ProductsIndex() {
  return (
    <div class="component">
      <FileDetails file="routes/products/index.jsx" />
    </div>
  )
}
```

Now change the URL path to `/products` and make the same observations we did for `/contacts`.