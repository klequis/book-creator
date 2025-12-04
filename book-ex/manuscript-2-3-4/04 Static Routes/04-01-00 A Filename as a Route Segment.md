## 4.1 A Filename as a Route Segment

Earlier we distinguished between component files named `index` and "named files". In this section, we will make our first use of a named file.

When you create a route with a named file, it creates a new route segment. Let's create the file `routes/contacts.jsx` which will create the route `/contacts`:

1. Create `/routes/contacts.jsx`

{title: "contacts.jsx"}
```jsx
import FileDetails from '~/file-details.jsx'

export default function Contacts() {
  return (
    <div class="component">
      <FileDetails file="routes/contacts.jsx" />
    </div>
  )
}
```

Now, in your browser, change the URL path to `/contacts` and you will see the component from `contacts.jsx` rendered. Note that the URL path segment `contacts` came from the name of the file.


![UI with /contacts route active](resources/static-routes-contacts.png)

Here are some important things to take note of for each route we will create in this book:

- When the page in the browser's address par is identical to the route created by the fullname (full path + filename ) of a file under the `routes/` directory, the component from the file will be displayed. In the current example, the URL path is `/contacts` which matches the file `routes/contacts.jsx`.
- The text displayed in each component identifies the file that is rendering that part of the UI and thereby which components are active for a given path/route.

{blurb, class: warning}
It might be tempting to think that the `/contacts` route renders all three components you see on the page. However, `app.jsx` and `root-layout.jsx` are not part of a route. `app.jsx` is rendered because it is the root component of our application. `root-layout.jsx` is rendered because it is the `root` property of `<Router>`. The only component rendered as part of the `/contacts` route is `<Contacts>` from `contacts.jsx`.
{/blurb}