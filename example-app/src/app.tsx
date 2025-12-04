import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { RootLayout } from './components/root-layout'
import { Link, MetaProvider, Title } from '@solidjs/meta'
// import "./flatly.css"
import "./buttons.css"
import "./ui.css"
// import "./app.scss"

export default function App() {
  return (
    <MetaProvider>
      <main class="container">

        <Title>simple-intro</Title>
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <Router root={RootLayout}>
          <FileRoutes />
        </Router>
      </main>
    </MetaProvider>
  )
}
