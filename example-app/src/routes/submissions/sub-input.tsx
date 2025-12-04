import { addUserNoRedirect } from '~/client-api/query-action'
import { useSubmission } from '@solidjs/router'
import { addItem } from '~/client-api/express-data'
import { createEffect, createSignal, Match, onMount, Switch } from 'solid-js'
import { log } from '~/utils'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

export default function SubInput() {
  const sub = useSubmission(addUserNoRedirect)
  // let inputRef!: HTMLInputElement;
  const [inputData, setInputData] = createSignal()
  createEffect(() => {
    //* sub.input
    if (sub.input) {
      let data: object[] = []
      //* sub.input
      console.log('sub.input:', sub.input)
      //* sub.input.length
      console.log('sub.input.length:', sub.input.length)
      //* sub.input[0]
      console.log('sub.input[0]:', sub.input[0])
      //* sub.input[0].size
      console.log('sub.input[0].size:', (sub.input[0] as any).size)
      //* sub.input[0].get('name')
      console.log("sub.input[0].get('name'):", sub.input[0].get('name'))
      //* sub.input[0].get('age')
      console.log("sub.input[0].get('age'):", sub.input[0].get('age'))
      //* sub.input[0].forEach
      sub.input[0].forEach((value, key) => {
        data.push({ key, value })
      })
      //* used in formDataToObject()
      console.log('data:', data)
    }
  })
  return (
    <Component filename="submissions/sub-input.tsx" isRouteRoot={true} title="submissions>sub-input">
      <div>
      <h2>sub.input</h2>
      <div>
        <div>
          <div>
            <div>
              <FormTitle text="Submission Input Test" />
              <form action={addUserNoRedirect} method="post" novalidate>
                {/* Name Field */}
                <div>
                  <Label for="name" text="Name" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value="Ian"
                    placeholder="Enter name (default for testing)"
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
                    placeholder="Enter age (default for testing)"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button type="submit">Submit Form</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div id="sub-input">
        <h4>console.log(sub.input)</h4>

        <pre>
          {sub.input
            ? `[${sub.input.map((item) => item.constructor.name).join(', ')}]`
            : 'undefined'}
        </pre>

        <h4>console.log(sub.input.length)</h4>
        <pre>
          {sub.input ? `${sub.input.length}` : 'undefined'}
        </pre>

        <h4>console.log(sub.input[0])</h4>
        <pre>
          {sub.input && sub.input[0]
            ? `${sub.input[0].constructor.name} {size: ${
                Array.from(sub.input[0]).length
              }}`
            : 'undefined'}
        </pre>

        <h4>console.log((sub.input[0] as any).size)</h4>
        <pre>
          {sub.input && sub.input[0]
            ? `${(sub.input[0] as any).size || 'undefined'}`
            : 'undefined'}
        </pre>

        <h4>console.log(sub.input[0].get('name'))</h4>
        <pre>
          {sub.input && sub.input[0]
            ? `${sub.input[0].get('name') || 'null'}`
            : 'undefined'}
        </pre>

        <h4>console.log(sub.input[0].get('age'))</h4>
        <pre>
          {sub.input && sub.input[0]
            ? `${sub.input[0].get('age') || 'null'}`
            : 'undefined'}
        </pre>

        <h4>console.log(data)</h4>
        <pre>
          {inputData() ? `${JSON.stringify(inputData(), null, 2)}` : '[]'}
        </pre>
        {/*         */}
      </div>
    </div>
    </Component>
  )
}
