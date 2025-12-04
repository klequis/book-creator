## 3.6 Adding the Root Route

In this section, we will add our first route. It will be the _root route_, a.k.a the _index route_. In a real-life application, it will most likely be the home page. The path for the root route is `/`. The full URL in our example code will be `http://localhost:3000/`. Note that some browsers display the `/` after the port number, while others do not.

You may be familiar with `index.html` as the default page for a web server, or `index.js` as the default file in NodeJS. It is often called the "index file" or "default file". With Solid Router you create an index/default route by placing a file named `index.jsx` in the root of `src/routes`.

To create a route with Solid Router and file-based routing, you create component files inside the `src/routes` directory.

With Solid Router, a file named `index` does not create a new URL/route segment. Therefore, adding a `routes/index.jsx` file creates the root route `/`.

- Create `src/routes`.
- Create `src/routes/index.jsx`:

{title: "src/routes/index.jsx"}
```jsx
export default function Index() {
  return (
    <div class="component">
      <div class="filename">
        <div>
          file: <code>routes/index.jsx</code>
        </div>
        <div class="filename">
          route: <code>/</code>
        </div>
      </div>
    </div>
  )
}
```
Here is our updated application. To make clear what components are being rendered for a given route, each component rendered by a route will show its full name (path + filename). The route will always be the same as the full name (minus `.jsx`), except for `index` files, which as noted earlier, do not add a segment to the path. The component rendered is always the default export of the file shown in the UI.

![The current state of UI with route added](resources/config-router-root-route-added.png)

Congratulations, you just created your first route!