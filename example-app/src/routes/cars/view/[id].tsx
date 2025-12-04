//* users/view/[id].tsx
import { createEffect, Show } from 'solid-js'
import { createAsync, RouteDefinition, useParams } from '@solidjs/router'
import type { Car } from '~/types'
import { getCars } from '~/client-api/query-action'
import { Component } from '~/components/component/component'
// tmp utils
import { log } from '~/utils'

export const route = {
  preload({ params }) {
    return getCars(params.id)
  },
} satisfies RouteDefinition

export default function User() {
  const params = useParams()
  // make this an if user || []
  const user = createAsync(() => getCars(params.id), {
    //* setting a typed initial value simplifies the syntax
    //* in the JSX in the rturn statement.
    //TODO: If you have time, explain
    //TODO: what it would be if you din't set the initial value
    //TODO: maybe show what it would be if the return type were simplier
    initialValue: { success: true, data: [] as Car[], error: null },
  })

  createEffect(() => {
    log('blue', 'view/[id].tsx', {
      dataLen: user().data.length,
      user: user().data[0],
    })
  })

  return (
    <Component filename="users/view/[id].tsx" isRouteRoot={true} title="User Detail">
      <h2>User Detail</h2>
      <Show when={user().data.length > 0} fallback={<p>Loading...</p>}>
        <div>
          <p>
            <strong>ID:</strong> {user().data[0].id}
          </p>
          <p>
            <strong>Make:</strong> {user().data[0].make}
          </p>
          <p>
            <strong>Model:</strong> {user().data[0].model}
          </p>
          <p>
            <strong>Year:</strong> {user().data[0].year}
          </p>
          <p>
            <strong>Miles:</strong> {user().data[0].miles.toLocaleString()}
          </p>
        </div>
      </Show>
    </Component>
  )
}
