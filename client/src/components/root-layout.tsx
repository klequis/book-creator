import { ErrorBoundary, Suspense } from 'solid-js'
import type { RouteSectionProps, A } from '@solidjs/router'
import { Component } from './component/component'
import { Nav } from '~/components/nav/nav'

export function RootLayout(props: RouteSectionProps) {
  return (
    <div>
      <h2>break</h2>
      <h2>/break</h2>
      <Component
        filename="components/root-layout.tsx"
        collapsible={false}
        isRouteRoot={false}
        title="Root Layout"
      >
        {/* <Nav /> */}
        <Suspense>
          {/*//TODO: re-enable ErrorBoundary */}
          {/* <ErrorBoundary fallback={<div>ErrorBoundary in RootLayout</div>}> */}
          {props.children}
          {/* </ErrorBoundary> */}
        </Suspense>
      </Component>
    </div>
  )
}
