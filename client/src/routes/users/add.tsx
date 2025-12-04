import { useSubmission } from '@solidjs/router'
import { addUser } from '~/client-api/query-action'
import { Alert } from '~/components/alert'
import { createEffect } from 'solid-js'
// import { log } from '~/utils'
import { logSubmission } from '~/utils/log-submission'
import { logSubmissionProxy } from '~/utils/log-submission-proxy'
import { logSubmissionInput } from '~/utils/log-submission-input'
import { Component } from '~/components/component/component'

import Label from '~/components/zz.label'

/*
  //* userSubmission props
    - readonly input: undefined;
    - readonly result: undefined;
    - readonly error: undefined;
    - readonly pending: undefined;
    - readonly url: undefined;
    - clear: () => void;
    - retry: () => void;
*/

const log = console.log

export default function AddUser() {
  const sub = useSubmission(addUser)

  createEffect(() => {
    log('NEW')
    // logSubmission('AddUser sub', sub)
    log('sub', sub)

    // Use the utility function to log comprehensive proxy analysis
    // logSubmissionProxy(sub, 'AddUser Sub Proxy')

    // When pending is true, analyze the input array in detail
    if (sub.pending === true && sub.input) {
      log('\n🔍 PENDING SUBMISSION - ANALYZING INPUT ARRAY')
      // logSubmissionInput(sub.input, 'AddUser Pending Input')
    }
  })
  return (
    <Component filename="users/add.tsx" isRouteRoot={true} title="Add User">
      <div>
        {/* //TODO: This should be class 'form-title' but that class needs to be
        //TODO: modified first to be what form-subtitle is now. */}
        <p>Enter user details below</p>
        <Alert />
        <form action={addUser} method={'post'} novalidate>
          {/* Name Field */}
          <div>
            <Label for="name" text="Full Name" />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter user's first and last name"
              required
            />
          </div>

          {/* Age Field */}
          <div>
            <Label for="age" text="Age (1-120 years)" />
            <input
              type="number"
              name="age"
              id="age"
              placeholder="Enter age"
              min="1"
              max="120"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button type="button" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit">
              Add User
            </button>
          </div>
        </form>
      </div>
    </Component>
  )
}
