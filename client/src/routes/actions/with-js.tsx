import { addUserNoRedirect } from '~/client-api/query-action'
import { Component } from '~/components/component/component'
import { PageTitle } from '~/components/page-title'
// ?? import { clientOnly } from '@solidjs/start'

import Label from '~/components/zz.label'

export default function WithJs() {
  let formRef!: HTMLFormElement
  return (
    <Component filename="actions/with-js.tsx" isRouteRoot={true} title="Add User (With JS)">
      <PageTitle text="With .js files" />
      <form
        ref={formRef}
        action={addUserNoRedirect}
        method="post"
        onSubmit={(e) => {
          // Wait a tick and then reset the form
          // Otherwise the form inputs are cleard too soon and
          // the action receives empty values
          setTimeout(() => {
            formRef.reset()
          }, 0)
        }}
      >
        <div>
          <Label for="name" text="Name" />
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <Label for="age" text="Age" />
          <input type="number" id="age" name="age" />
        </div>
        <button type="submit">Submit Form</button>
      </form>
    </Component>
  )
}
