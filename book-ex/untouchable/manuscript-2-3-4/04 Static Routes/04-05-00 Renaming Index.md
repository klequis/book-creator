## 4.5 Renaming Index

We currently have two files in our routes hierarchy named `index.jsx`. In a large project, you may end up with many files named `index.jsx`, and you may find this confusing when working in your editor or searching for files. Solid Router offers an alternative naming convention for the default file, enclosing the filename in `()`.

The text in `()` can be anything. It doesn't need to be the name of the containing directory or any other specific name. However, one common naming convention is to use the name of its parent directory. Let's give that a try:

1. Rename `products/index.jsx` to `products/(products).jsx`.
2. Change the `file` property of `<FileDetails>` to match the new file name.

{title: "products/(products).jsx"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function ProductsIndex() {
  return (
    <div class="component">
      <FileDetails 
        file="routes/products/(products).jsx"
      />
    </div>
  )
}
```

Now navigate to `/products` and note there is no change in behavior.

The other `index.jsx` file in our project is the root route, `/` in `routes/index.jsx`. If we named it after its parent directory it would be `(routes).jsx` which is not a good name. `/` is usually the home page, so let's change its name to reflect that.

1. Rename `routes/index.jsx` `routes/(home).jsx`.
2. Change the name of the component in `home.jsx` to `Home`.
3. Change the `file` property of `<FileDetails>` to match the new file name.

{title: "routes/(home).jsx"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function Home() {
  return (
    <div class="component">
      <FileDetails file="routes/(home).jsx" />
    </div>
  )
}
```

In the next section, we will add navigation to our application.
