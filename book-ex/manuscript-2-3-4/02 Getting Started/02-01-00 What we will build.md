## 2.1 What we will build

Before we jump into creating our project, let's take a look at what it will look like in a later chapter. The project and the UI are both intentionally simple. I have eliminated, to the extent possible, things that don't relate to routing. Much of file-based routing is about files and the paths to file, so the UI is designed to show which files the components currently rendered on the page are from.

![The current state of UI](resources/exploring-the-ui.png)

Putting aside the navigation buttons the UI is currently displaying three components from three files, `app.jsx`, `root-layout.jsx` and `products/index.jsx`. `app.jsx` is the parent of `root-layout.jsx`, which in turn is the parent of `index.jsx `.