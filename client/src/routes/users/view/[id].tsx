//* users/view/[id].tsx
import { createEffect, createResource, createSignal, Show } from 'solid-js'
import { createAsync, RouteDefinition, useParams } from '@solidjs/router'
import type { User } from '~/types'
import { getUsers } from '~/client-api/query-action'
import { log } from '~/utils'
import { Component } from '~/components/component/component'


export const route = {
  preload({ params }) {
    return getUsers(params.id)
  },
} satisfies RouteDefinition

export default function User() {
  const params = useParams()
  // make this an if user || []
  const user = createAsync(() => getUsers(params.id), {
    //* setting a typed initial value simplifies the syntax
    //* in the JSX in the rturn statement.
    //TODO: If you have time, explain
    //TODO: what it would be if you din't set the initial value
    //TODO: maybe show what it would be if the return type were simplier
    initialValue: { success: true, data: [] as User[], error: null },
  })

  createEffect(() => {
    log('blue', 'view/[id].tsx', {
      dataLen: user().data.length,
      user: user().data[0],
    })
  })

  return (
    <Component filename="users/view/[id].tsx" isRouteRoot={true} title="View User">
      <h2>User Detail</h2>
      <Show when={user().data.length > 0} fallback={<p>Loading...</p>}>
        <div>
          <p>
            <strong>ID:</strong> {user().data[0].id}
          </p>
          <p>
            <strong>Name:</strong> {user().data[0].name}
          </p>
          <p>
            <strong>Age:</strong> {user().data[0].age}
          </p>
          <p>
            <strong>Default:</strong> {user().data[0].isdefault ? 'Yes' : 'No'}
          </p>
        </div>
      </Show>
    </Component>
  )
}
