import {
  A,
  createAsyncStore,
  RouteDefinition,
  useSubmission,
} from '@solidjs/router'
import { createEffect, For, Show, Match, Switch, Suspense } from 'solid-js'
import type { User } from '~/types'
import { getUsers, deleteUser } from '~/client-api/query-action'
import { DisplayUser } from '~/components/display-user'
import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'
import { ResetData } from '~/components/reset-data'
// tmp utils
import { logSubmission } from '~/utils/log-submission'
import { log, logFn } from '~/utils'

import { ButtonBar } from '~/components/button-bar'

export const route = {
  preload() {
    getUsers()
  },
} satisfies RouteDefinition

const getUserById = (users: User[], id: number): User | undefined => {
  return users.find((u) => u.id === id)
}

const getUserNameById = (users: User[], id: number): string => {
  const user = getUserById(users, id)
  return user ? user.name : 'Unknown User'
}

export default function Users() {
  const users = createAsyncStore(() => getUsers(), {
    initialValue: { success: true, data: [] as User[], error: null },
  })
  const sub = useSubmission(deleteUser)

  // createEffect(() => {
  //   console.log('sub', sub.input?.[0])
  // })

  return (
    <Component filename="users/(users).tsx" isRouteRoot={true} title="Users">
      <ButtonBar
        right={
          <>
            <button class="btn-icon btn-success btn-md">
              <A href="/users/add">Add User</A>
            </button>
            <ResetData dataset="users" />
          </>
        }
      />

      {/* Delete Status Alert */}
      <Show when={sub.pending}>
        <Alert mode="danger">
          <div>
            <div>
              <span>Deleting user #{sub.input?.[0].toString()}</span>
              <br />
              <span>
                {getUserNameById(users().data, sub.input?.[0] as number)}
              </span>
            </div>
          </div>
        </Alert>
      </Show>

      {/* Users Content */}
      <div>
        <Suspense
          fallback={
            <Alert mode="info">Suspense fallback: Loading users...</Alert>
          }
        >
          <Switch
            fallback={
              <Alert mode="danger">
                <h2>Switch fallback: Case not covered by switch</h2>
              </Alert>
            }
          >
            <Match when={!users().success}>
              <Alert mode="danger">
                <h2>Fetch of users failed: `users.success === false`</h2>
                <p>{users().error?.message}</p>
                {users().error?.tip && (
                  <div>
                    <strong>Tip:</strong> {users().error?.tip}
                  </div>
                )}
              </Alert>
            </Match>

            <Match when={users().data.length === 0}>
              <h3>No users found</h3>
            </Match>

            <Match when={users().data.length > 0}>
              <div>
                <table class="table table-sm table-hover">
                  <TableHead />
                  <tbody>
                    <For each={users().data}>
                      {(u: User) => <DisplayUser user={u} />}
                    </For>
                  </tbody>
                </table>
              </div>
            </Match>
          </Switch>
        </Suspense>
      </div>
      {/* </div> */}
    </Component>
  )
}

function TableHead() {
  return (
    <thead>
      {/* thead > tr */}
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Actions</th>
      </tr>
    </thead>
  )
}
