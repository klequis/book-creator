import { createEffect, createSignal, For, Show } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { navGroups } from './nav-groups'

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
    <div>
      <button
        // cls={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
        //   isOpen()
        //     ? 'bg-slate-500 text-white'
        //     : 'text-slate-100 hover:text-white hover:bg-slate-600'
        // }`}
        onclick={() => setOpen(props.index)}
      >
        {store.groups[props.index].groupName}
      </button>
    </div>
  )
}

export function SmallPlus() {
  const [colNum, setColNum] = createSignal(3)
  // const [menuItemsOpen, setMenuItemsOpen] = createSignal(false)
  const location = useLocation()

  // Keep dropdown open if it contains the active route
  createEffect(() => {
    const activeGroupIndex = findGroupWithActiveRoute(location.pathname)
    // setMenuItemsOpen(store.openGroup >= 0)
    if (activeGroupIndex !== -1) {
      setStore('openGroup', activeGroupIndex)
    }
  })

  createEffect(() => {
    const grp = store.groups[store.openGroup]
    if (grp) {
      setColNum(grp.dropdownCols)
    }
  })

  return (
    <div>
      <nav>
        <For each={navGroups}>{(group, idx) => <Group index={idx()} />}</For>
      </nav>

      <Show when={store.openGroup >= 0}>
        <div>
          <div>
            <For each={store.groups[store.openGroup].links}>
              {(link) => (
                <A href={link.href} end>
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
