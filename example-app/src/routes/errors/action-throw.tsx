import { throwActon } from '~/client-api/handle-error'
import { Alert } from '~/components/alert'
import { useSubmission } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { actionThrow } from '~/client-api/query-action'
import { Component } from '~/components/component/component'

import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

//* Result
//* Action fails silently terminal and browser

export default function ActionThrow() {
  return (
    <Component filename="errors/action-throw.tsx" isRouteRoot={true} title="action>throw">
      <div>
        <div>
          <div>
            <div>
              <FormTitle text="Action Throw Test" />
              <form
                action={throwActon}
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
                    placeholder="Enter name (test error handling)"
                    required
                  />
                </div>

                {/* Submit Button */}s
                <div>
                  <button type="submit">Test Action Throw</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Component>
  )
}
