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
import { throwQuery } from '~/client-api/handle-error'
import { log, logFn } from '~/utils'
// import Fatal from '~/components/fatal'
import { DisplayUser } from '~/components/display-user'
import { User } from '~/types'
import { Alert } from "~/components/alert";
import { Component } from '~/components/component/component'

//* Result

const modName = 'query>throw'

export default function QueryThrow() {
  const users = createAsyncStore(() => throwQuery(), {
    initialValue: { success: true, data: [] as User[], error: null },
  })

  return (
    <Component filename="errors/query-throw.tsx" isRouteRoot={true} title="query>throw">
      

      <Suspense
        fallback={
          <Alert>
            <h2>{`Suspense: ${modName}`}</h2>
          </Alert>
        }
      >
        <ErrorBoundary
          fallback={(err) => (
            <Alert>
              <h2>{`ErrorBoundary: ${modName}`}</h2>
              <p>{(err as Error).message}</p>
            </Alert>
          )}
        >
          <Switch
            fallback={<Alert><h2>{`Switch: ${modName}`}</h2></Alert>}
            
          >
            <Match when={users().data.length > 0}>
              <ul>
                <For each={users()?.data}>
                  {(u) => {
                    logFn('blue', '<For users()>')
                    log('blue', 'users().data:', users().data)
                    log('blue', 'u', u)
                    return <DisplayUser user={u} />
                  }}
                </For>
              </ul>
            </Match>
          </Switch>
        </ErrorBoundary>
      </Suspense>
    </Component>
  )
}


