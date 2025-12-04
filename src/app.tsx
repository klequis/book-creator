// @refresh reload
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import { MetaProvider } from "@solidjs/meta"
import { RootLayout } from "./components/RootLayout"
import "./app.css"

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <RootLayout>
            <Suspense>
              {props.children}
            </Suspense>
          </RootLayout>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
