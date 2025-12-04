//* users/edit/[id].tsx
import { createEffect, Match, Show, Suspense, Switch } from 'solid-js'
import {
  createAsync,
  RouteDefinition,
  RouteSectionProps,
  useParams,
  useSubmission,
} from '@solidjs/router'
import type { User } from '~/types'
import { getUsers, updateUser } from '~/client-api/query-action'
import { logFn, log } from '~/utils'
import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

export const route = {
  preload({ params }) {
    return getUsers(params.id)
  },
} satisfies RouteDefinition

/**
 * @path /users/edit/:id
 * @param id User ID
 */
export default function EditUser(props: RouteSectionProps) {
  logFn('blue', 'EditUser')
  const params = useParams()
  log('blue', '', { props, id: params.id })
  // make this an if user || []
  const user = createAsync(() => getUsers(params.id), {
    //   //* setting a typed initial value simplifies the syntax
    //   //* in the JSX in the rturn statement.
    //   //TODO: If you have time, explain
    //   //TODO: what it would be if you din't set the initial value
    //   //TODO: maybe show what it would be if the return type were simplier
    initialValue: { success: true, data: [] as User[], error: null },
  })

  createEffect(() => {
    log('blue', 'createEffect', { user: user() })
  })
  /*
- Type '{ message: string; tip?: string | undefined; } | null'
-  is not assignable to type 'string | Element'.


- Type '{ message: string; tip?: string | undefined; }' 
- is not assignable to type 'string | Element'.ts(2322)
const user: () => QueryResponse<{
    id: number;
    name: string;
    isdefault: boolean;
    age?: number | undefined;
}>
*/
  // const sub = useSubmission(updateUser)
  return (
    <Component
      filename="users/edit/[id].tsx"
      isRouteRoot={true}
      title="Edit User"
    >
      <h2>Edit User</h2>
      <Show when={!user()}>
        <p>You should never see this because a default value was set</p>
      </Show>
      {/* !user() will always be false */}
      {/* users().length will initially be zero */}

      <Show when={user()}>
        <Switch>
          <Match when={user().error}>
            <Alert mode="danger">
              <h2>Error updating user</h2>
              <p>{user().error?.message}</p>
            </Alert>
          </Match>
          <Match when={user().data.length > 0}>
            <div>
              <h1>Edit User</h1>
              <p>
                User: {user().data[0].name} (ID: {user().data[0].id})
              </p>
              <form action={updateUser} method={'post'} novalidate>
                {/* Name Field */}
                <div>
                  <Label for="name" text="Full Name" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter user's first and last name"
                    value={user().data[0].name}
                    required
                  />
                </div>

                {/* Age Field */}
                <div>
                  <Label for="age" text="Age (1-120 years)" />
                  <input type="hidden" name="id" value={user().data[0].id} />
                  <input
                    type="number"
                    name="age"
                    id="age"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    value={user().data[0].age ?? ''}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button type="button" onClick={() => window.history.back()}>
                    Cancel
                  </button>
                  <button type="submit">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </Match>
        </Switch>
      </Show>
    </Component>
  )
}