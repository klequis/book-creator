import { createEffect, createSignal, For, Show } from 'solid-js'
import { Filename } from '~/components/component/filename'
import { getTime } from '~/utils/get-time'
import ChavronLeft from 'lucide-solid/icons/chevron-left'
import ChevronDown from 'lucide-solid/icons/chevron-down'
import ChevronRight from 'lucide-solid/icons/chevron-right'
// border border-white

function Segment(props: { text: string; separator: boolean }) {
  return (
    <>
      <div>{props.text}</div>
      <Show when={props.separator}>
        <div>
          <ChevronRight size={16} strokeWidth={2} />
        </div>
      </Show>
    </>
  )
}

function Breadcrumbs(props: { text: string }) {
  const segments = props.text.split('/').filter(Boolean)
  return (
    <For each={segments}>
      {(segment, idx) => (
        <Segment text={segment} separator={idx() !== segments.length - 1} />
      )}
    </For>
  )
}

export function ComponentTitlebar(props: {
  filename: string
  isCollapsed: boolean
  toggleCollapse: () => void
}) {
  const [currentTime, setCurrentTime] = createSignal(getTime())

  // Update time whenever any prop changes
  createEffect(() => {
    setCurrentTime(getTime())
  })

  return (
    <div>
      <Breadcrumbs text={props.filename} />
    </div>
  )
}
