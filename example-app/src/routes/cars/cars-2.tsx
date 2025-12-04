// solid
import {
  createAsyncStore,
  useNavigate,
  RouteDefinition,
} from '@solidjs/router'
import { For, Match, Switch, Suspense } from 'solid-js'
// types
import type { Car } from '~/types'
// client api
import { getCars } from '~/client-api/query-action'
// components
import { DisplayCar } from '../../components/display-car'
import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'
import { ResetData } from '~/components/reset-data'
// tmp utils
import { log, logFn } from '~/utils'

export const route = {
  preload() {
    getCars()
  },
} satisfies RouteDefinition

export default function Cars() {
  const cars = createAsyncStore(() => getCars(), {
    initialValue: { success: true, data: [] as Car[], error: null },
  })
  const navigate = useNavigate()
  //* for use debugging useSubmission
  // log('blue', '1. cars.data.length:', cars()?.data?.length)

  return (
    <Component 
      filename="cars/(cars).tsx" 
      isRouteRoot={true}
      collapsible={true} 
      initialState="open"
      title="Cars List"
    >
      <ResetData dataset="cars" />
      <Suspense fallback={<Alert>Loading cars...</Alert>}>
        <Switch
          fallback={
            <Alert mode="danger">
              <h2>Switch fallback: Case not covered by switch</h2>
            </Alert>
          }
        >
          <Match when={!cars().success}>
            <Alert mode="danger">
              <h2>`cars.success === false`</h2>
              <p>{cars().error?.message}</p>
              <p>Tip: {cars().error?.tip}</p>
            </Alert>
          </Match>
          <Match when={cars().data.length === 0}>
            <Alert mode="info">
              <h2>No cars found</h2>
            </Alert>
          </Match>
          <Match when={cars().data.length > 0}>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Make/Model</th>
                    <th>Year</th>
                    <th>Miles</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={cars().data}>{(c: Car) => <DisplayCar car={c} />}</For>
                </tbody>
              </table>
            </div>
          </Match>
        </Switch>
      </Suspense>
    </Component>
  )
}

