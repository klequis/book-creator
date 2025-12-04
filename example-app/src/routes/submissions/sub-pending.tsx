import { addUserNoRedirect } from '~/client-api/query-action'
import { useSubmission } from '@solidjs/router'
import { createEffect, createSignal, onMount, For } from 'solid-js'
import { getTime } from '~/utils'
import { Component } from '~/components/component/component'


import Label from '~/components/zz.label'
import FormTitle from '~/components/FormTitle'

type PendingHistoryEntry = {
  timestamp: string
  value: boolean | undefined
  isHeader?: boolean
  headerText?: string
}

export default function SubPending() {
  const sub = useSubmission(addUserNoRedirect)
  const [pendingHistory, setPendingHistory] = createSignal<
    PendingHistoryEntry[]
  >([])
  const [submitCount, setSubmitCount] = createSignal(0)
  const [lastPendingValue, setLastPendingValue] = createSignal<
    boolean | undefined
  >(undefined)
  const [currentValueChanged, setCurrentValueChanged] = createSignal(false)

  // Add form load header on mount
  onMount(() => {
    console.group('Form load')
    setPendingHistory([
      {
        timestamp: '',
        value: undefined,
        isHeader: true,
        headerText: 'Form load',
      },
    ])
  })

  createEffect(() => {
    console.log('Effect triggered for sub.pending change')
    const timestamp = getTime()
    const value = sub.pending
    const previousValue = lastPendingValue()

    // Only proceed if the value actually changed (but allow first run when previousValue is undefined)
    if (value === previousValue && previousValue !== undefined) return

    // Track when pending changes from false/undefined to true (new submission)
    // Create the Submit group BEFORE logging the true value
    if (value === true && previousValue !== true) {
      const newCount = submitCount() + 1
      setSubmitCount(newCount)

      // End previous group and start new submit group
      console.groupEnd()
      console.group(`Submit ${newCount}`)

      // Add submit header
      setPendingHistory((prev) => [
        ...prev,
        {
          timestamp: '',
          value: undefined,
          isHeader: true,
          headerText: `Submit ${newCount}`,
        },
      ])
    }

    const entry: PendingHistoryEntry = {
      timestamp,
      value,
    }

    // Console log and add to history in same effect
    console.log(`${timestamp} sub.pending:`, value)
    setPendingHistory((prev) => [...prev, entry])
    setLastPendingValue(value)

    // Trigger animation for current value change
    setCurrentValueChanged(true)
    setTimeout(() => setCurrentValueChanged(false), 500)
  })

  return (
    <Component filename="submissions/sub-pending.tsx" isRouteRoot={true} title="submissions>sub-pending">
      <div>
        <h2>sub.pending History</h2>

        <div>
          <div>
            <div>
              <div>
                <FormTitle text="Pending Submission Test" />
                <form
                  action={addUserNoRedirect}
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
                      placeholder="Enter name (track pending state)"
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
                      placeholder="Enter age (monitor progress)"
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

        <div id="sub-pending">
          <h4>Current Value</h4>
          <pre>
            {String(sub.pending)}
          </pre>

          <h4>
            console.log(sub.pending) - History
          </h4>
          <pre>
            <For each={pendingHistory()}>
              {(entry) =>
                entry.isHeader
                  ? entry.headerText + '\n'
                  : `${entry.timestamp} sub.pending: ${String(entry.value)}\n`
              }
            </For>
          </pre>
        </div>
      </div>
    </Component>
  )
}
