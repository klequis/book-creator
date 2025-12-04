import { Show, For, createEffect, createSignal } from 'solid-js'
import TextStrongDark from './text-strong-dark'
import TextDarkBgLight from './text-dark-bg-light'
import BgSuccessContainer from './bg-success-container'
import CodeTextDarkBold from './code-text-dark-bold'
import BgDangerContainer from './bg-danger-container'
import TextInfoSmall from './text-info-small'
import AlertWarning from './alert-warning'
import TextStrong from './text-strong'
import MarginContainer from './margin-container'
import MarginContainer2 from './margin-container2'
import MarginStart2 from './margin-start2'
import StrongSmallSuccess from './strong-small-success'
import StateSection from './state-section'

interface StateSnapshotProps {
  pending?: boolean
  input?: any[]
  error?: { message?: string } | null
  result?: { success?: boolean; data?: any; errors?: string } | null
}

export default function StateSnapshot(props: StateSnapshotProps) {
  const [entries, setEntries] = createSignal<Array<{ key: string; value: string }>>([])

  // Console logging effects
  createEffect(() => {
    console.log('🔍 Display iteration - props.input:', props.input)
    
    if (props.input && props.input[0]) {
      console.log('🔍 About to iterate entries...')
      const tempEntries: Array<{ key: string; value: string }> = []
      props.input[0].forEach((value: any, key: string) => {
        console.log(`🔍 Display entry - ${key}: ${value}`)
        tempEntries.push({ key, value: value.toString() })
      })
      console.log('🔍 Final entries array:', tempEntries)
      setEntries(tempEntries)
    } else {
      setEntries([])
    }
  })

  return (
    <div>
      <h6>State Snapshot:</h6>
      <div>
        {/* Input State - Restored FormData iteration */}
        <StateSection label="input" className="">
          <Show
            when={props.input !== undefined}
            fallback={
              <TextDarkBgLight>undefined</TextDarkBgLight>
            }
          >
            <MarginContainer>
              {/* OK */}
              <TextInfoSmall>
                Array length: {props.input?.length}, Type:{' '}
                {props.input?.[0]?.constructor?.name}
              </TextInfoSmall>
              <Show
                when={
                  props.pending === true &&
                  props.input &&
                  props.input.length > 0
                }
                fallback={
                  <AlertWarning>
                    <small>
                      No input data available
                      <br />
                      <strong>Debug:</strong> pending={String(props.pending)},
                      length={props.input?.length || 0}
                    </small>
                  </AlertWarning>
                }
              >
                <BgSuccessContainer>
                  <TextInfoSmall marginBottom="2">
                    <strong>Debug:</strong> pending={String(props.pending)},
                    length={props.input?.length || 0}
                  </TextInfoSmall>
                  <StrongSmallSuccess>Form entries:</StrongSmallSuccess>
                  <MarginContainer2>
                    <Show
                      when={props.input && props.input[0]}
                      fallback={
                        <div>
                          No entries found during iteration
                        </div>
                      }
                    >
                      <Show
                        when={entries().length > 0}
                        fallback={
                          <div>
                            No entries found during iteration
                          </div>
                        }
                      >
                        <For each={entries()}>
                          {(entry) => (
                            <div>
                              <CodeTextDarkBold>
                                {entry.key}
                              </CodeTextDarkBold>
                              :
                              <code>
                                "{entry.value}"
                              </code>
                            </div>
                          )}
                        </For>
                      </Show>
                    </Show>
                  </MarginContainer2>
                </BgSuccessContainer>
              </Show>
            </MarginContainer>
          </Show>
        </StateSection>

        {/* Error State */}
        <StateSection label="error" className="">
          <Show
            when={props.error}
            fallback={
              <TextDarkBgLight>null</TextDarkBgLight>
            }
          >
            <BgDangerContainer 
              message={props.error?.message || 'Error occurred'}
              className="ms-2"
            />
          </Show>
        </StateSection>

        {/* Result State */}
        <StateSection label="result" className="">
          <Show
            when={props.result}
            fallback={
              <TextDarkBgLight>undefined</TextDarkBgLight>
            }
          >
            <MarginStart2>
              <Show when={props.result?.success}>
                <BgSuccessContainer>
                  <TextStrong color="success">✅ Success</TextStrong>
                  <pre>
                    {JSON.stringify(props.result?.data, null, 2)}
                  </pre>
                </BgSuccessContainer>
              </Show>
              <Show when={!props.result?.success}>
                <BgDangerContainer 
                  message={`❌ Failed: ${props.result?.errors}`}
                />
              </Show>
            </MarginStart2>
          </Show>
        </StateSection>
      </div>
    </div>
  )
}
