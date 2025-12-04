import { For } from 'solid-js'
import { addUserNoRedirect } from '~/client-api/query-action'
import { useSubmissions } from '@solidjs/router'
import { Component } from '~/components/component/component'

//! This code may not be correct. Review before using.

export default function Submissions() {
  // const subs = useSubmissions(addUserNoRedirect)
  return (
    <Component
      filename="submissions/subs.tsx"
      isRouteRoot={true}
      title="submissions>subs"
    >
      {/* //! fix this code
      // <div>
      //   <ul>
      //     <For each={Array.from(subs.entries())}>
      //       {(item) => <li>{JSON.stringify(item)}</li>}
      //     </For>
      //   </ul>
      // </div> */}
    </Component>
  )
}
