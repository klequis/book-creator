import { For, Show } from 'solid-js'
import ChevronRight from 'lucide-solid/icons/chevron-right'

function Segment(props: { text: string; separator: boolean }) {
  return (
    <div>
      {props.text}
      <ChevronRight strokeWidth={2} />
    </div>
  )
}

function Breadcrumbs(text: string) {
  const segments = text.split('/').filter(Boolean)
  return (
    <For each={segments}>
      {(segment, idx) => (
        <Segment text={segment} separator={idx() !== segments.length - 1} />
      )}
    </For>
  )
}