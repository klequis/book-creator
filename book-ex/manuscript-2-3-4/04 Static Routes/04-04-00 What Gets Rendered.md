## 4.4 What Gets Rendered

In this section, we will make a simple but important observation.

Here is the directory structure we created for `/products/*`:

```shell
└── 📁routes
    └── 📁products
        └── 📁categories
            └── keyboards.jsx
            └── mice.jsx
        └── index.jsx
```

This table shows what components are rendered on the page for each of the three `/product/*` routes:

| When you navigate to                   | The component rendered is from | Is called a |
| -------------------------------------- | ---------------------------------: | -------------: |
| `/routes/products` | `index.jsx` | root route     |
| `/routes/products/categories/mice` | `mice.jsx` | nested route   |
| `/routes/products/categories/keyboards` | `keyboards.jsx` | nested route   |

The observation is that when you navigate to `/products/categories/mice` or `/products/categories/keyboards`, the component in `/products/index.jsx` is not rendered. The only component rendered is the one at the end of a route.

However, a component in a route file can have children and in this way, multiple elements can be rendered. For example, `products/index.jsx` could contain a title component and a list of products:

```jsx
export default function ProductsIndex() {
  return (
    <div class="component">
      <Title>List of Products</Title>
      <ul>
        <li>Keyboards</li>
        <li>Mice</li>
        <li>etc</li>
      </ul>
    </div>
  )
}
```

{blurb, class: information}
Only the component at the end of the route gets rendered.
{/blurb}

If you are curious, having the full name as text in each component makes it easy to see what gets rendered on the page when inspecting the DOM. Here is the DOM for the `/products` route:

![DOM in the browser showing what is rendered](resources/whats-rendered-products.png)
