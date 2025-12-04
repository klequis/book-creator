import { addUserNoRedirect } from '~/client-api/query-action'
import { useSubmission } from '@solidjs/router'
import { createEffect, createSignal, Match, onMount, Switch } from 'solid-js'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

export default function SubUrl() {
  const sub = useSubmission(addUserNoRedirect)
  
  createEffect(() => {
    //* sub.url
    if (sub.url) {
      console.log('sub.url (encoded):', sub.url)
      console.log('sub.url (decoded):', decodeURIComponent(sub.url))
    }
  })
  
  return (
    <Component filename="submissions/sub-url.tsx" isRouteRoot={true} title="submissions>sub-url">
      <div>
      <h2>sub.url</h2>
      
      <div>
        <div>
          <div>
            <div>
              <FormTitle text="URL Submission Test" />
              <form action={addUserNoRedirect} method="post" novalidate>
                {/* Name Field */}
                <div>
                  <Label for="name" text="Name" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value="Ian"
                    placeholder="Enter name (test URL tracking)"
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
                    placeholder="Enter age (monitor URL changes)"
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

      <div id="sub-url">
        <h4>console.log(sub.url) - encoded</h4>
        <pre>
          {sub.url ? `"${sub.url}"` : 'undefined'}
        </pre>
        
        <h4>console.log(sub.url) - decoded</h4>
        <pre>
          {sub.url ? `"${decodeURIComponent(sub.url)}"` : 'undefined'}
        </pre>
      </div>
    </div>
    </Component>
  )
}