// import { createAsyncStore, RouteDefinition } from '@solidjs/router'
// import { createEffect, For, Match, Show, Switch, Suspense, createSignal } from 'solid-js'
// // import { getUsers } from '~/lib/api'
// import { getUsers } from '~/client-api/query-action'
// import type { User } from '~/types'
// import { AddUser } from '~/components/AddUser'
// import { log } from '~/utils/log'
// import Fatal from '~/components/fatal'

// function SingleUser(props: { user: User }) {
//   return (
//     <li class="user-li">
//       <span>
//         {props.user.id}, {props.user.name},{' '}
//         {props.user.isadmin ? 'is admin' : 'not admin'}
//       </span>
//     </li>
//   )
// }

// export const route = {
//   preload() {
//     getUsers()
//   },
// } satisfies RouteDefinition

// //? Sorting
// //? -------
// //* sorted users. could make function
// //* each={users()?.sort((a,b) => a.id - b.id)}
// //* OR use !
// //* each={users()!.sort((a,b) => a.id - b.id)}

// //? Use of "!" non-null assertion operator
// //? --------------------------------------
// // const contactsLength = () => contacts()?.length || 0;
// // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
// //* `users()?.length! > 0` the `!` is well protected
// //*  by <Show when={users()}> and we can safely use
// //*  the non-null assertion operator `!` to tell TypeScript
// //*  that `users()?.length` will not be null or undefined.

// //! const users: AccessorWithLatest<Error | User[] | undefined>

// /*
// const users: AccessorWithLatest<never[] | {
//     success: boolean;
//     data: never[];
//     error: string;
// } | {
//     success: boolean;
//     data: User[];
//     error: null;
// } | undefined>

// */

// /*
//   const users: AccessorWithLatest<never[] | {
//       success: boolean;
//       data: User[];
//       error: string;
//   } | {
//       success: boolean;
//       data: User[];
//       error: null;
//   } | undefined>
// */

// export default function Users() {
//   //* AccessorWithLatest<UserResponse | undefined>
//   const users = createAsyncStore(() => getUsers())
//   // const usersLength = () => users()?.data.length || 0;
//   const [hasUsers, setHasUsers] = createSignal(false);
//   // console.log('1. usersLength:', usersLength())
//   createEffect(() => {
//     setHasUsers((users()?.data?.length ?? 0) > 0 ? true : false);
//     console.log('2. usersLength:', hasUsers())
//     console.log('users():', users())
//   })

//   return (
//     <>
//       <h1>Users</h1>
//       <p>Show's fallback does not display.</p>
//       <p>If you put Suspense inside of Show its fallback will not display.</p>
//       {/* <Suspense fallback={<h2 style={{ color: 'red' }}>Suspense: Loading users...</h2>}> */}
//       <Show
//         when={hasUsers()}
//         fallback={<h2>Show: Loading users...</h2>}
//       >
//         {/* <Show when={users()} fallback={<div>Loading users...</div>}> */}
//         {/* <Switch fallback={<div>Loading users...</div>}> */}
//         {/* <Match when={users()?.length === 0}>No users found</Match> */}
//         {/* <Match when={users()?.length > 0}> */}
//         <ul>
//           <For each={users()?.data}>{(u) => <SingleUser user={u} />}</For>
//         </ul>
//         {/* </Match> */}
//         {/* </Switch> */}
//       </Show>
//       {/* </Suspense> */}
//       <AddUser />
//     </>
//   )
// }

// /*
// {/* <Show when={users().error}>
//         {/* <div class="error">
//           <h2>Error loading users</h2>
//           <p>{(users() as Error).message}</p>
//         </div>
//         {/* <Fatal error={users() as Error} />
        
//       /* </Show>
// */
