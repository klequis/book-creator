import { A, createAsyncStore, RouteDefinition } from '@solidjs/router'
import { createEffect, For, Match, Show, Switch, Suspense } from 'solid-js'
// import { getUsers } from '~/lib/api'
import type { User } from '~/types'
import { getUsers } from '~/client-api/query-action'
import { log, logFn } from '~/utils'
// import Fatal from '~/components/fatal'
import { DisplayUser } from '~/components/display-user'
import { Alert } from '~/components/alert'
import { PageTitle } from '~/components/page-title'
import { Component } from '~/components/component/component'

export const route = {
  preload() {
    getUsers()
  },
} satisfies RouteDefinition

//? Sorting
//? -------
//* sorted users. could make function
//* each={users()?.sort((a,b) => a.id - b.id)}
//* OR use !
//* each={users()!.sort((a,b) => a.id - b.id)}

//? Use of "!" non-null assertion operator
//? --------------------------------------
// const contactsLength = () => contacts()?.length || 0;
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
//* `users()?.length! > 0` the `!` is well protected
//*  by <Show when={users()}> and we can safely use
//*  the non-null assertion operator `!` to tell TypeScript
//*  that `users()?.length` will not be null or undefined.

//! const users: AccessorWithLatest<Error | User[] | undefined>

export default function Users() {
  const users = createAsyncStore(() => getUsers(), {
    //* setting a typed initial value simplifies the syntax
    //* in the JSX in the rturn statement.
    //TODO: If you have time, explain
    //TODO: what it would be if you din't set the initial value
    //TODO: maybe show what it would be if the return type were simplier
    initialValue: { success: true, data: [] as User[], error: null },
  })
  //* for use debugging useSubmission
  // log('blue', '1. users.data.length:', users()?.data?.length)

  // createEffect(() => {
  //   log('blue', '--- <Users /> createEffect ---')
  //   log('blue', 'users:', users) // resource
  //   log('blue', 'users():', users()) // proxy object
  // })

  // createEffect(() => {
  //   log('red', '--- <Users /> createEffect ---')
  //   log('blue', 'users:', users)      // resource
  //   log('blue', 'users():', users())  // proxy object

  // })

  return (
    <Component filename="users/users-2.tsx" isRouteRoot={true} title="Users">
      <PageTitle text="Users" />
      <Switch
        fallback={
          <Alert>
            <h2>Switch fallback</h2>
          </Alert>
        }
      >
        <Match when={!users().success}>
          <Alert>
            <h2>`users.success === false`</h2>
            <p>{users().error?.message || 'Unknown error occurred'}</p>
          </Alert>
        </Match>
        <Match when={users().data.length === 0}>
          <Alert>
            <h2>No users found</h2>
          </Alert>
        </Match>
        <Match when={users().data.length > 0}>
          <For each={users().data}>{(u: User) => <DisplayUser user={u} />}</For>
        </Match>
      </Switch>
    </Component>
  )
}

