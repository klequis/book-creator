import { addUserNoRedirect } from '~/client-api/query-action'
import { useSubmission } from '@solidjs/router'
import { createEffect } from 'solid-js'
import './submissions.css'

export default function SubResult() {
  const sub = useSubmission(addUserNoRedirect)
  createEffect(() => {
    if (sub.result) {
      //* sub.result
      console.log('sub.result:', sub.result)
    }
  })
  return (
    <div class="result-container">
      <h2 class="result-title">sub.result</h2>

      <form action={addUserNoRedirect} method="post" class="result-form">
        <div class="form-group">
          <label for="name" class="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value="Ian"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="age" class="form-label">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value="32"
            class="form-input"
          />
        </div>
        <button class="submit-button">Submit Form</button>
      </form>
      {/* 
      <div id="sub-result" class="data-section">
        <h3 class="section-heading">console.log(sub.result)</h3>
        <pre class="code-output">
          {sub.result ? JSON.stringify(sub.result, null, 2) : 'undefined'}
        </pre>
      </div> */}
    </div>
  )
}
