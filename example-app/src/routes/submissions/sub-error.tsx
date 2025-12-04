import {
  actionThrow,
  addUser,
  addUserThrowNoRedirect,
} from '~/client-api/query-action'
import { useSubmission } from '@solidjs/router'
import { createEffect, ErrorBoundary, Show } from 'solid-js'
import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

export default function SubResult() {
  const sub = useSubmission(addUserThrowNoRedirect)
  createEffect(() => {
    console.log('sub.input.length:', sub.input?.length)
    console.log('sub:', sub)
    console.log('sub.input:', sub.input)
    console.log('sub.input[0]:', sub.input?.[0])
    console.log('**sub.error:', sub.error)
    console.log('**sub.retry:', sub.retry)
    console.log('**sub.retry():', sub.retry())
    console.log('sub.result:', sub.result)

    // console.log('sub.error:', JSON.stringify(sub.error?.message, null, 2))
  })
  return (
    <Component filename="submissions/sub-error.tsx" isRouteRoot={true} title="submissions>sub-error">
      <div>
        {/* <ErrorBoundary fallback={(err) => (
        <Alert mode="danger">
          <h2>ErrorBoundary caught an error:</h2>
          <p>{err.message}</p>
        </Alert>
      )}> */}
        <h4>console.log(sub.result)</h4>
        <Alert mode="success">
          <h2>I got it to work!</h2>
        </Alert>
        <h2>And then</h2>

        <Show when={sub.error}>
          {(error) => (
            <div>
              <Alert mode="danger">
                <p>Error: {sub.error.message}</p>
                <button type="button" onClick={() => sub.clear()}>Clear</button>
                <button type="button" onClick={async () => sub.retry()}>Retry</button>
              </Alert>
            </div>
          )}
        </Show>
        <Show when={!sub.error}>
          <div>
            <div>
              <div>
                <div>
                  <FormTitle text="Error Submission Test" />
                  <form
                    action={addUserThrowNoRedirect}
                    method="post"
                    novalidate
                  >
                    {/* Name Field */}
                    <div>
                      <Label for="name" text="Name" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value="Ian"
                        placeholder="Enter name (will trigger error)"
                        required
                      />
                    </div>

                    {/* Age Field */}
                    <div>
                      <Label for="age" text="Age" />
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value="32"
                        placeholder="Enter age (test error handling)"
                        min="1"
                        max="120"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button type="submit">Submit Form (Will Error)</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Show>

        <div id="sub-result">
          <h4>console.log(sub.error)</h4>
          <pre>
            {sub.error
              ? JSON.stringify(sub.error?.message, null, 2)
              : 'undefined'}
          </pre>
        </div>
        {/* </ErrorBoundary> */}
      </div>
    </Component>
  )
}
