import { A, createAsyncStore, RouteDefinition } from '@solidjs/router'
import type { ParentComponent, FlowComponent, ParentProps } from 'solid-js'
import {
  createEffect,
  For,
  Match,
  Show,
  Switch,
  Suspense,
  ErrorBoundary,
} from 'solid-js'
import { throwQueryTryCatchReturn } from '~/client-api/handle-error'
import { log, logFn } from '~/utils'
import { DisplayUser } from '~/components/display-user'
import { Alert } from '~/components/alert'
import { User } from '~/types'
import { Component } from '~/components/component/component'


export default function QueryTryThrowCatchReturn() {
  const users = createAsyncStore(() => throwQueryTryCatchReturn(), {
    initialValue: { success: true, data: [] as User[], error: null },
  })

  return (
    <Component filename="errors/query-try-throw-catch-return.tsx" isRouteRoot={true} title="query>try>throw>catch>return">
      <Suspense
        fallback={
          <h2>Suspense: Loading users...</h2>
        }
      >
        <ErrorBoundary
          fallback={(err) => (
            <Alert>ErrorBoundary: Error occurred</Alert>
          )}
        >
          <Show when={users().error}>
            <div>
              <p>{users().error?.message}</p>
            </div>
          </Show>
          <Switch
            fallback={<h2>Switch: No users found</h2>}
          >
                      <Match when={users().data.length === 0}>
            <Alert mode="info">
              <h2>Switch: No users found</h2>
            </Alert>
          </Match>
          </Switch>
        </ErrorBoundary>
      </Suspense>
    </Component>
  )
}
