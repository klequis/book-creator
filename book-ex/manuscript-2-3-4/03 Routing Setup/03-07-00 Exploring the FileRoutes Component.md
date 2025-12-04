## 3.6 Exploring the FileRoutes Component

We can use `console.log` to look behind the scenes at what `<FileRoutes>` does.

In `app.jsx`, put `console.log('routes', FileRoutes())` just above the `return` statement, and then refresh the page if it hasn't already done so. 

Looking in the browser's console, you should see an array with two objects. Each object defines a route. The objects are used by the `<Router>` component to display the appropriate route.

Below is the object for the `/` route. I have shortened the paths so they fit on the page. Two of its properties are relevant to us at the moment:

- `path` is the route.
- `filePath` is the file where the component for that route is imported from. In this case, it is `routes/index.jsx`.

```js
[
  {
    page: true,
    $component: {
      src: "/.../src/routes/index.jsx?pick=default&pick=$css",
    },
    path: "/",
    filePath: "/.../src/routes/index.jsx",
    id: "/",
    info: {
      filesystem: true,
    },
  },
];
```

The way we are calling the `<FileRoutes>` component is a great illustration that Solid components are simply functions. `console.log('routes', FileRoutes())` works because `FileRoutes` is simply the name of a function that you can call with `()`.

You can choose to remove the `console.log` or not. It clutters the console but has no other impact.

That concludes our chapter on setting up routing. In the next chapter, you will learn more about creating routes and their relationship to URL path segments.
