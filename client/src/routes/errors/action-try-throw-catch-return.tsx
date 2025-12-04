import { throwActonTryCatchReturn } from '~/client-api/handle-error'
import { Alert } from '~/components/alert'
import { useSubmission } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

//* Result
//* Error in terminal
//* No response in browser

export default function ActionTryThrowCatchReturn() {
  return (
    <Component filename="errors/action-try-throw-catch-return.tsx" isRouteRoot={true} title="action>try>throw>catch>return">
      <div>
        <div>
          <div>
            <div>
              <FormTitle text="Try-Catch-Return Test" />
              <form
                action={throwActonTryCatchReturn}
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
                    placeholder="Enter name (test try-catch-return)"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button type="submit">Test Try-Catch-Return</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Component>
  )
}
