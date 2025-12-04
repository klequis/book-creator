import { createEffect, For, Show } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { navGroups } from '~/components/nav/nav-groups'

//* Store Data
function storeData() {
  return {
    openGroup: -1,
    numGroups: navGroups.length,
    groups: navGroups.map((group, idx) => ({
      ...group,
      index: idx,
    })),
  }
}

//* Create Store
const [store, setStore] = createStore(storeData())

//* Set Open Group
function setOpen(index: number) {
  if (store.openGroup === index) {
    setStore('openGroup', -1)
  } else {
    setStore('openGroup', index)
  }
}

//* Check if a group contains the active route
function findGroupWithActiveRoute(pathname: string) {
  return navGroups.findIndex((group) =>
    group.links.some((link) => link.href === pathname)
  )
}

function Group(props: { index: number }) {
  const isOpen = () => props.index === store.openGroup

  return (
    <li class="nav-menu-item">
      <button
        class={`nav-menu-link ${isOpen() ? 'active' : ''}`}
        onclick={() => setOpen(props.index)}
      >
        {store.groups[props.index].displayName}
      </button>
    </li>
  )
}

export function Menu() {
  const location = useLocation()

  // Keep dropdown open if it contains the active route
  createEffect(() => {
    const activeGroupIndex = findGroupWithActiveRoute(location.pathname)
    if (activeGroupIndex !== -1) {
      setStore('openGroup', activeGroupIndex)
    }
  })

  const getColumnClass = () => {
    if (store.openGroup >= 0) {
      const cols = store.groups[store.openGroup].dropdownCols
      return `nav-menu-dropdown-links-cols-${cols}`
    }
    return ''
  }

  return (
    <div class="nav-menu-container">
      <nav class="nav-menu">
        <ul class="nav-menu-tabs">
          <For each={navGroups}>{(group, idx) => <Group index={idx()} />}</For>
        </ul>
      </nav>

      <Show when={store.openGroup >= 0}>
        <div class="nav-menu-dropdown">
          <div class={`nav-menu-dropdown-links ${getColumnClass()}`}>
            <For each={store.groups[store.openGroup].links}>
              {(link) => (
                <A 
                  href={link.href} 
                  class="nav-menu-dropdown-link"
                  activeClass="active"
                  end
                >
                  {link.text}
                </A>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}

