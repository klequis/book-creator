import { Title } from '@solidjs/meta'
import { ParentProps, Show, createSignal } from 'solid-js'
import { ComponentTitlebar } from '~/components/component/component-titlebar'

/**
 * @filename The filename to display in the title bar
 * @title The title to set for the browser tab
 * @collapsible Whether the component is collapsible (default: true)
 * @initialState The initial collapsed state ('open' or 'closed', default: 'open')
 * @isRouteRoot Set to `true` when the component is the top-level route component. When true
 * the component will be rendered inside a centered max-width container. Defaults to false.
 */
export function Component(
  props: {
    filename: string
    title: string
    collapsible?: boolean
    initialState?: 'open' | 'closed' // Defaults to 'open'
    isRouteRoot?: boolean
  } & ParentProps
) {
  const [isCollapsed, setIsCollapsed] = createSignal(
    props.initialState === 'closed'
  )

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed())
  }

  return (
    <div>
      <Title>{props.title}</Title>
      <ComponentTitlebar
        filename={props.filename}
        isCollapsed={isCollapsed()}
        toggleCollapse={toggleCollapse}
      />
      {/*//* when open */}
      <div>
        <Show when={!isCollapsed()}>{props.children}</Show>
      </div>
    </div>
  )
}
