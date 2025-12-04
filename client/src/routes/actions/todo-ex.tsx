import { addUserNoRedirect } from '~/client-api/query-action'
import { Show, For, Suspense, createResource } from 'solid-js'
import { A, createAsync, useLocation, useSubmission } from '@solidjs/router'
import { Component } from '~/components/component/component'

import { PageTitle } from '~/components/page-title'
import { Button } from '~/components/buttons/button'
import Label from '../../components/zz.label'

export default function TodoEx() {
  let nameInputRef!: HTMLInputElement
  let ageInputRef!: HTMLInputElement
  let formRef!: HTMLFormElement

  return (
    <Component filename="actions/todo-ex.tsx" isRouteRoot={true} title="Add User (No Redirect)">
      <section>
        <header>
          <PageTitle text="Add User" />

          <form
            ref={formRef}
            action={addUserNoRedirect}
            method="post"
            onSubmit={(e) => {
              // Prevent submission if name is empty
              if (!nameInputRef.value.trim()) {
                e.preventDefault()
                return
              }

              // Clear form after a short delay to show the submission
              setTimeout(() => {
                nameInputRef.value = ''
                ageInputRef.value = ''
              }, 100)
            }}
          >
            <div>
              <Label for="name" text="Name" />
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Enter user name"
                ref={nameInputRef}
                autofocus
              />
            </div>

            <div>
              <Label for="age" text="Age" />
              <input
                name="age"
                id="age"
                type="number"
                placeholder="Enter user age"
                ref={ageInputRef}
              />
            </div>
            <Button type="submit" text="Add Todo" />
          </form>
        </header>
      </section>
    </Component>
  )
}
