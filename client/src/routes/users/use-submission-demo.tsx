import { useSubmission } from '@solidjs/router'
import { addUserNoRedirect } from '~/client-api/query-action'
import { createEffect, createSignal, Show, Switch, Match, For } from 'solid-js'
import StateSnapshot from '~/components/submission-demo/state-snapshot'
import { Component } from '~/components/component/component'

import { PageTitle } from '~/components/page-title'

import Label from '../../components/zz.label'

/**
 * Advanced demonstration of useSubmission(addUserNoRedirect) with interactive features
 * This component showcases dynamic UI responses, form validation states,
 * and advanced submission tracking patterns
 */
export default function NewComponent2() {
  const sub = useSubmission(addUserNoRedirect)
  const [submissionHistory, setSubmissionHistory] = createSignal<
    Array<{
      timestamp: Date
      pending: boolean | undefined
      input: [formData: FormData] | undefined
      inputDetails: Array<{ key: string; value: string }> | null
      error: any
      result: any
    }>
  >([])

  // Track collapsed/expanded state for each submission
  const [collapsedSubmissions, setCollapsedSubmissions] = createSignal<
    Set<number>
  >(new Set())

  // Track the previous pending state to detect changes
  const [prevPending, setPrevPending] = createSignal<boolean | undefined>(
    undefined
  )

  createEffect(() => {
    console.log('sub.input?.[0], sub.pending:', sub.input?.[0])
    const a = sub.input?.length || 0
    console.log('sub.input?.length:', a)
    if (a > 0) {
      console.log(`sub.input[0].entries():`, sub.input?.[0].entries())
      sub.input?.[0].forEach((value, key) => {
        console.log(`Entry - ${key}: ${value.toString()}`)
      })
    }

    // Only track when sub.pending changes
    if (sub.pending !== prevPending()) {
      const timestamp = new Date()

      // Create detailed state snapshot
      const stateSnapshot = {
        timestamp,
        pending: sub.pending,
        input: sub.input,
        inputDetails: null as any,
        error: sub.error,
        result: sub.result,
      }

      // Extract FormData details if available - using your pattern
      console.log('sub.input?.[0], sub.pending:', sub.input?.[0])
      const inputLength = sub.input?.length || 0
      console.log('sub.input?.length:', inputLength)

      if (inputLength > 0 && sub.input?.[0] instanceof FormData) {
        console.log(`sub.input[0].entries():`, sub.input?.[0].entries())
        const formDataEntries: Array<{ key: string; value: string }> = []

        sub.input?.[0].forEach((value, key) => {
          console.log(`Entry - ${key}: ${value.toString()}`)
          formDataEntries.push({ key, value: value.toString() })
        })

        stateSnapshot.inputDetails = formDataEntries
        console.log('📝 Captured FormData entries:', formDataEntries)
      } else {
        console.log('⚠️ No FormData found in sub.input:', sub.input)
      }

      // Add to history only when pending state changes
      setSubmissionHistory((prev) => [...prev, stateSnapshot])

      // Update the previous pending state
      setPrevPending(sub.pending)
    }
  })

  const getGroupedSubmissions = () => {
    const history = submissionHistory()
    const submissions: Array<{
      submissionNumber: number
      startTime: Date
      transitions: typeof history
    }> = []

    let currentSubmission: {
      submissionNumber: number
      startTime: Date
      transitions: typeof history
    } | null = null
    let submissionCounter = 1

    history.forEach((event) => {
      if (event.pending === true) {
        // Start of new submission - save previous if exists
        if (currentSubmission) {
          submissions.push(currentSubmission)
        }
        // Start new submission
        currentSubmission = {
          submissionNumber: submissionCounter++,
          startTime: event.timestamp,
          transitions: [event],
        }
      } else if (event.pending === false && currentSubmission) {
        // End of current submission
        currentSubmission.transitions.push(event)
        submissions.push(currentSubmission)
        currentSubmission = null
      }
    })

    // Handle incomplete submission (still pending)
    if (currentSubmission) {
      submissions.push(currentSubmission)
    }

    return submissions.reverse() // Most recent first
  }

  const clearHistory = () => {
    setSubmissionHistory([])
    sub.clear()
  }

  const toggleSubmission = (submissionNumber: number) => {
    setCollapsedSubmissions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(submissionNumber)) {
        newSet.delete(submissionNumber) // Expand
      } else {
        newSet.add(submissionNumber) // Collapse
      }
      return newSet
    })
  }

  const isSubmissionCollapsed = (submissionNumber: number) => {
    return collapsedSubmissions().has(submissionNumber)
  }

  const getFormDataPreview = () => {
    if (!sub.input || !sub.input[0]) return null

    const formData = sub.input[0]
    if (!(formData instanceof FormData)) return null

    const entries = Array.from(formData.entries())
    return entries.reduce((acc, [key, value]) => {
      acc[key] = value.toString()
      return acc
    }, {} as Record<string, string>)
  }

  return (
    <Component
      filename="users/use-submission-demo.tsx"
      isRouteRoot={true}
      title="useSubmission Demo #2"
    >
      <PageTitle text="useSubmission Demo #2: Advanced Patterns & Interactive Features" />
      <p>
        Dynamic UI responses, validation states, and submission tracking
      </p>

      {/* Real-time submission status bar */}
      <div>
        <div>
          <div>
            <div>
              <Switch
                fallback={<span>IDLE</span>}
              >
                <Match when={sub.pending}>
                  <span>
                    <span
                      role="status"
                    ></span>
                    PENDING
                  </span>
                </Match>
                <Match when={sub.result && !sub.error}>
                  <span>SUCCESS</span>
                </Match>
                <Match when={sub.error}>
                  <span>ERROR</span>
                </Match>
              </Switch>

              <small>
                <Show when={sub.url}>
                  Action: {decodeURIComponent(sub.url!)}
                </Show>
              </small>
            </div>

            <div>
              <Show when={typeof sub.clear === 'function'}>
                <button
                  type="button"
                  onClick={clearHistory}
                >
                  Clear All
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic form with real-time feedback */}
      <div>
        <div>
          <div>
            <div>
              {/* Complete form with all fields */}
              <form action={addUserNoRedirect} method="post">
                <div>
                  <Label for="name2" text="Name:" />
                  <Switch>
                    <Match when={sub.pending}>
                      <small>(Submitting...)</small>
                    </Match>
                    <Match when={sub.error}>
                      <small>
                        (Previous submission failed)
                      </small>
                    </Match>
                    <Match when={sub.result}>
                      <small>
                        (Previous submission succeeded)
                      </small>
                    </Match>
                  </Switch>
                  <input
                    type="text"
                    name="name"
                    id="name2"
                    required
                    disabled={sub.pending}
                    placeholder={
                      sub.pending ? 'Processing...' : 'Enter user name'
                    }
                  />
                  <Show when={sub.error}>
                    <div>
                      Please correct the errors and try again.
                    </div>
                  </Show>
                </div>

                <div>
                  <Label for="age2" text="Age:" />
                  <input
                    type="number"
                    name="age"
                    id="age2"
                    required
                    disabled={sub.pending}
                    min="1"
                    max="120"
                  />
                </div>

                {/* Advanced button states with Switch/Match */}
                <div>
                  <Switch>
                    <Match when={sub.pending}>
                      <button type="button">Submitting...</button>
                    </Match>
                    <Match when={sub.error}>
                      <button type="submit">Try Again</button>
                    </Match>
                    <Match when={sub.result}>
                      <button type="submit">Add Another User</button>
                    </Match>
                    <Match when={true}>
                      <button type="submit">Add User</button>
                    </Match>
                  </Switch>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Real-time submission monitoring panel */}
        <div>
          <div>
            <div>
              <h4>Live Monitor</h4>
            </div>
            <div>
              {/* Current state display */}
              <div>
                <h6>Current State:</h6>
                <Switch
                  fallback={
                    <div>
                      <small>🔄 Idle - Ready for submission</small>
                    </div>
                  }
                >
                  <Match when={sub.pending}>
                    <div>
                      <div>
                        <div
                          role="status"
                        ></div>
                        <div>
                            <small>
                              <strong>Processing submission</strong>
                            </small>
                            <Show when={sub.input}>
                              <br />
                              <small>
                                FormData objects: {sub.input?.length || 0}
                              </small>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </Match>
                  <Match when={sub.error}>
                    <div>
                      <small>
                        ❌ <strong>Error:</strong>{' '}
                        <span>
                          {sub.error?.message || 'Submission failed'}
                        </span>
                      </small>
                    </div>
                  </Match>
                  <Match when={sub.result}>
                    <div>
                      <small>
                        ✅ <strong>Success:</strong> User created successfully
                      </small>
                    </div>
                  </Match>
                </Switch>
              </div>

              {/* Action buttons */}
              <div>
                <Show when={typeof sub.clear === 'function'}>
                  <button
                    type="button"
                    onClick={() => sub.clear()}
                  >
                    Clear State
                  </button>
                </Show>

                <Show when={typeof sub.retry === 'function' && sub.error}>
                  <button
                    type="button"
                    onClick={() => sub.retry()}
                  >
                    Retry Last Submission
                  </button>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending State Change History */}
      <div>
        <div>
          <h3>Pending State Change History</h3>
          <div>
            <small>
              {submissionHistory().length} state transitions
            </small>
            <Show when={submissionHistory().length > 0}>
              <button
                type="button"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </Show>
          </div>
        </div>
        <div>
          <p>
            <strong>
              This tracks only when <code>sub.pending</code> changes
            </strong>{' '}
            - the critical submission lifecycle events
          </p>
          <Show
            when={submissionHistory().length > 0}
            fallback={
              <div>
                <div>
                  <h5>No pending state changes yet</h5>
                  <p>
                    Submit the form to see when <code>sub.pending</code>{' '}
                    transitions from <code>undefined</code> → <code>true</code>{' '}
                    → <code>false</code>
                  </p>
                </div>
              </div>
            }
          >
            <div>
              <For each={getGroupedSubmissions()}>
                {(submission, submissionIndex) => (
                  <div>
                    {/* Clickable Submission Header */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleSubmission(submission.submissionNumber)
                        }
                      >
                        <div>
                          <span>
                            <Show
                              when={isSubmissionCollapsed(
                                submission.submissionNumber
                              )}
                              fallback={
                                <span>
                                  ▼ Expanded
                                </span>
                              }
                            >
                              <span>
                                ► Collapsed
                              </span>
                            </Show>
                          </span>
                          <h4>
                            Submission #{submission.submissionNumber} [
                            {submission.startTime.toLocaleString()}]
                          </h4>
                        </div>
                        <div>
                          <small>
                            {submission.transitions.length} transitions
                          </small>
                          <span>
                            {isSubmissionCollapsed(submission.submissionNumber)
                              ? '►'
                              : '▼'}
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Conditionally show transitions */}
                    <Show
                      when={!isSubmissionCollapsed(submission.submissionNumber)}
                    >
                      <div>
                        <For each={submission.transitions.slice().reverse()}>
                          {(event, transitionIndex) => (
                            <div>
                              <div>
                                <h5>
                                  Transition #
                                  {submission.transitions.length -
                                    transitionIndex()}
                                </h5>
                                <small>
                                  {event.timestamp.toLocaleTimeString()}
                                </small>
                              </div>

                              <div>
                                <div>
                                  <h6>
                                    pending changed to:
                                  </h6>
                                  <Switch>
                                    <Match when={event.pending === true}>
                                      <span>
                                        🔄 TRUE
                                      </span>
                                    </Match>
                                    <Match when={event.pending === false}>
                                      <span>
                                        ✅ FALSE
                                      </span>
                                    </Match>
                                    <Match when={event.pending === undefined}>
                                      <span>
                                        ⚪ UNDEFINED
                                      </span>
                                    </Match>
                                  </Switch>
                                </div>

                                <StateSnapshot
                                  pending={event.pending}
                                  input={event.input}
                                  error={event.error}
                                  result={event.result}
                                />
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </Component>
  )
}
