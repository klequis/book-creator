# 4 Static Routes

Broadly speaking, there are two types of routes: static and dynamic. Dynamic routes take parameters from the path in the URL whereas static routes do not. This chapter will introduce you to static routes. Dynamic routes will be covered in a later chapter.

We have already created our first static route which is the root route `/`, created by the file `/routes/index.jsx` and its function `Index()`. In this section, you will learn additional ways of creating static routes.

In Solid file-base routing, routes are created by creating files and directories under the `src/routes` directory.

{blurb, class: information}
For now, we are going to navigate between routes by editing the URL path in the browser. We will add navigation to our application in the next chapter.
{/blurb}