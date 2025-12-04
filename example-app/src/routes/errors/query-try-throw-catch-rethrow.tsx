import { A, createAsyncStore, RouteDefinition } from '@solidjs/router'
import {
  createEffect,
  For,
  Match,
  Show,
  Switch,
  Suspense,
  ErrorBoundary,
} from 'solid-js'
import { throwQueryTryCatchRethrow } from '~/client-api/handle-error'
import { log, logFn } from '~/utils'
import { DisplayUser } from '~/components/display-user'
import { User } from '~/types'
import { Alert } from "~/components/alert";
import { Component } from "~/components/component/component";
import { PageTitle } from "~/components/page-title";


export default function QueryTryThrowCatchRethrow() {
  const users = createAsyncStore(() => throwQueryTryCatchRethrow(), {
    initialValue: { success: true, data: [] as User[], error: null },
  })

  return (
    <Component filename="errors/query-try-throw-catch-rethrow.tsx" isRouteRoot={true} title="query>try>throw>catch>rethrow">
      <PageTitle text="query>try>throw>catch>rethrow" />
      <p>
        This route tests throwing an error, catching it, and rethrowing it from
        the query function.
      </p>

      <Suspense
        fallback={
          <h2>Suspense: Loading users...</h2>
        }
      >
        <ErrorBoundary
          fallback={(err) => (
            <div>
              <h3>ErrorBoundary: Error loading users</h3>
              <p>{(err as Error).message}</p>
            </div>
          )}
        >
          <Switch
            fallback={<h2>Switch: No users found</h2>}
          >
                      <Match when={users().data.length === 0}>
            <Alert mode="info">
              <h3>Switch: No users found</h3>
            </Alert>
          </Match>
          </Switch>
        </ErrorBoundary>
      </Suspense>
    </Component>
  )
}
