## 0.1 What is SolidStart

SolidStart is an open source meta-framework designed to unify components that make up a web application.

Looking at the [Solid Docs](https://docs.solidjs.com) website you will see four categories across the top of the page. Each of these is a separate package/library that you can find on [npm](https://www.npmjs.com/). Core and SolidStart are required parts of a SolidStart application. Router and Meta are optional.

![Navigation menu across the top of SoidJS documentation home page](top-of-solid-docs-website.png)


- **SolidStart:** As it says in the docs, "SolidStart is an open source meta-framework designed to unify components that make up a web application." SolidStart is built on top of and requires Core.

- **Core** The npm package for Core is named `solid-js` and is often called Solid or SolidJS. Core contains most of Solid's functionality. You can create an entire application with Core by itself.

- **Router:** Router contains most of the functionality that is the subject of this book. You are not required to use Solid Router with SolidStart but we will in this book.
- **Meta:** Meta enables you to manage the content of the document head such as adding `<link>` and `<meta>` tags. We will not be using it in this book.

{blurb, class: information}
A SolidStart project requires the use of Core. Therefore, learning SolidStart means also learning Core.
{/blurb}

That is SolidStart as a meta-framework at a high level, but there is a deeper level to SolidStart that includes [Vite](https://vitejs.dev), [Nitro](https://nitro.unjs.io), [Vinxi](https://vinxi.vercel.app), and [Seroval](https://seroval.vercel.app). Atila Fassina has written an excellent article on these parts of SolidStart in Smashing Magazine: [SolidStart: A Different Breed Of Meta-Framework](https://www.smashingmagazine.com/2024/01/solidstart-different-breed-meta-framework/).

{aside}
A *meta-framework* assembles differing parts to form a useful whole. In the case of software, it is a library that combines a group of libraries into something that prescribes, to one degree or another, a way of building an application. It is possible for one or more of the parts of a framework to also be a framework.

For example, if you combine a web server library, a front-end library, and a data-access library into a useful whole, you have created a meta-framework.
{/aside}
