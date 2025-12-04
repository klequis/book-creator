import { createStore } from 'solid-js/store'
import { createSignal, For } from 'solid-js'
import { Component } from '~/components/component/component'

type NavGroup = {
  index: number
  groupName: string
  displayName: string
  open: boolean
  links: Array<{ text: string; href: string }>
}

const [navData, setNavData] = createStore({
  groups: [
    {
      index: 0,
      groupName: 'main',
      displayName: 'Main',
      open: true,
      links: [
        { text: '/', href: '/' },
        { text: '/about', href: '/about' },
      ],
    },
    {
      index: 1,
      groupName: 'users',
      displayName: '/users:',
      open: true,
      links: [
        { text: 'Users', href: '/users' },
        { text: 'Add User', href: '/users/add' },
        { text: 'Users Submission Demo', href: '/users/use-submission-demo' },
      ],
    },
  ],
})

function NavGrp(props: { group: NavGroup }) {
  // const [idx, setIdx] = createSignal(props.group.index!)
  const idx = props.group.index
  const [isOpen, setIsOpen] = createSignal(props.group.open)
  const toggleIsOpen = () => {
    
    //* this works with props.group
    // console.log('Toggling group:', props.group.groupName)
    // console.log('Current isOpen:', props.group.open)
    // setNavData('groups', idx(), 'open', !isOpen())
    //* this works with navData
    // get current state by idx
    const open = navData.groups[idx].open
    console.log('Current open from store:', open)
    // toggle
    setNavData('groups', idx, 'open', !open)

  }
  return (<>
    <div id={props.group.groupName}>
      <div onClick={toggleIsOpen}>
        <p>{props.group.groupName}{' '}{isOpen() ? '(open)' : '(closed)'}</p>
        <p>{navData.groups[idx].open ? '(open)' : '(closed)'}</p>
      </div>
      <button onClick={toggleIsOpen}>
        Toggle
      </button>
    </div>
  </>)
}

export default function NavEx() {
  return (
    <Component filename="store-ex/index.tsx" isRouteRoot={true} title="Store Example">
      <h1>Hello, {navData.groups[0].displayName}</h1>
      <p>{navData.groups[0].open ? 'Open' : 'Closed'}</p>
      <button
        onClick={() => setNavData('groups', 0, 'open', (prev) => !prev)}
      >
        Toggle Nav Group
      </button>
      <For each={navData.groups}>
        {(group) => <NavGrp group={group} />}
      </For>
    </Component>
  )
}