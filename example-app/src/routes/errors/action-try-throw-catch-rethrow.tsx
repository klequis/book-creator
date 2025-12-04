import { createEffect, ErrorBoundary, Show, Suspense } from 'solid-js'
import { useSubmission } from '@solidjs/router'
import { actionTryThrowCatchRethrow } from '~/client-api/handle-error'

// import { logSubmission } from '~/utils/log-submission'
import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

//* Result
//* Error in terminal
//* No response in browser
export default function ActionTryThrowCatchRethrow() {
  const sub = useSubmission(actionTryThrowCatchRethrow)
  createEffect(() => {
    console.log('sub', sub.input?.[0])
    console.log('sub.error', sub.error)
  })

  return (
    <Component filename="errors/action-try-throw-catch-rethrow.tsx" isRouteRoot={true} title="action>try>throw>catch>rethrow">
      <ErrorBoundary fallback={(err) => <Alert>Error occurred in component</Alert>}>
        <Suspense
          fallback={<h2>Getting Contact</h2>}
        >
          <div>
            <div>
              <div>
                <div>
                  <FormTitle text="Try-Catch-Rethrow Test" />
                  <form
                    action={actionTryThrowCatchRethrow}
                    method={'post'}
                    novalidate
                  >
                    {/* Name Field */}
                    <div>
                      <Label for="name" text="Name" />
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Enter name (test try-catch-rethrow)"
                        required 
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button type="submit">Test Try-Catch-Rethrow</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Show when={sub.error}>
            <div>
              <Alert mode="danger">
                <h3>Error occurred during submission.</h3>
                <p>{sub.error?.message}</p>
              </Alert>
            </div>
          </Show>
          <Show when={sub.error === undefined}>
            <Alert mode="danger">
              <h3>sub.error is undefined</h3>
            </Alert>
          </Show>
          <Show when={sub.pending}>
            <div>
              <h2>Pending</h2>
              <h3>input: {sub.input?.[0].toString()}</h3>
            </div>
          </Show>

          <Show when={sub.input?.[0].get('name')}>
            {(name) => <div>Optimistic: {name() as string}</div>}
          </Show>
          
        </Suspense>
      </ErrorBoundary>
    </Component>
  )
}
