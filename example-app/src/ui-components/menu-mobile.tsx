import { createEffect, createSignal, For, Show } from 'solid-js'
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
    <div class="nav-menu-mobile-group">
      <button
        class={`nav-menu-mobile-group-btn ${isOpen() ? 'active' : ''}`}
        onclick={() => setOpen(props.index)}
      >
        {store.groups[props.index].displayName}
        <span class="nav-menu-mobile-chevron">{isOpen() ? '▼' : '▶'}</span>
      </button>
      
      <Show when={isOpen()}>
        <div class="nav-menu-mobile-links">
          <For each={store.groups[props.index].links}>
            {(link) => (
              <A 
                href={link.href} 
                class="nav-menu-mobile-link"
                activeClass="active"
                end
              >
                {link.text}
              </A>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export function MenuMobile() {
  const [isOpen, setIsOpen] = createSignal(false)
  const location = useLocation()

  // Keep dropdown open if it contains the active route
  createEffect(() => {
    const activeGroupIndex = findGroupWithActiveRoute(location.pathname)
    if (activeGroupIndex !== -1) {
      setStore('openGroup', activeGroupIndex)
      setIsOpen(true)
    }
  })

  const toggleMenu = () => {
    setIsOpen(!isOpen())
  }

  return (
    <div class="nav-menu-mobile-container">
      <button 
        class="nav-menu-mobile-hamburger"
        onclick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span class="nav-menu-mobile-hamburger-line"></span>
        <span class="nav-menu-mobile-hamburger-line"></span>
        <span class="nav-menu-mobile-hamburger-line"></span>
      </button>

      <Show when={isOpen()}>
        <nav class="nav-menu-mobile">
          <For each={navGroups}>
            {(group, idx) => <Group index={idx()} />}
          </For>
        </nav>
      </Show>
    </div>
  )
}
