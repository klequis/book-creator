import { Component } from '~/components/component/component'

import Label from '~/components/zz.label'
import { addUser } from '~/client-api/query-action'

export default function NoJSAction() {
  return (
    <Component filename="routes/actions/no-js.tsx" isRouteRoot={true} title="Add User (No JS)">
      <div>
        <h1>Add User (No JS)</h1>
        <p>This form works without JavaScript enabled</p>
        <form action={addUser} method={'post'} novalidate>
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
          <div>
            <button
              //TODO: this is not solid code, useNavigate or similar
              onClick={() => window.history.back()}
            >
              <span></span>
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
