import { Show } from 'solid-js'

export function HamburgerIcon(props: { isOpen: boolean }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <Show
        when={!props.isOpen}
        fallback={
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        }
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </Show>
    </svg>
  )
}
