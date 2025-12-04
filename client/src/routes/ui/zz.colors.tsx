import { For } from 'solid-js'
import { Component } from '~/components/component/component'

type Color = {
  name: string
  value: string
  description: string
}

const colors: Color[] = [
  { name: 'indigo-400', value: 'bg-indigo-400', description: 'Accent indigo' },
  { name: 'blue-400', value: 'bg-blue-400', description: 'Primary blue' },
  { name: 'cyan-400', value: 'bg-cyan-400', description: 'Info cyan' },
  { name: 'green-400', value: 'bg-green-400', description: 'Success green' },
  {
    name: 'emerald-400',
    value: 'bg-emerald-400',
    description: 'Alternative green',
  },
  {
    name: 'purple-400',
    value: 'bg-purple-400',
    description: 'Secondary purple',
  },
  { name: 'pink-400', value: 'bg-pink-400', description: 'Highlight pink' },
  { name: 'gray-200', value: 'bg-gray-200', description: 'Neutral gray' },
]

function Swatch(props: { color: Color }) {
  
  const c = `${props.color.value} w-32 h-16 text-xs text-white font-medium flex flex-col items-center justify-center rounded-md shadow-md m-2`
  return (
    // <div class={c}>Hello</div>
    <div class={c}>
      <div>{props.color.name}</div>
      <div>{props.color.description}</div>
    </div>
  )
}

export default function Colors() {
  // const s = "flex items-center border border-white"
  const s = 'flex flex-wrap border border-white'
  return (
    <Component filename="src/routes/ui/colors.tsx" isRouteRoot={true} title="ui>colors">
      {/* <For each={Object.keys(colors)}>{(color) => <Swatch colorClass={color} name={color} />}</For> */}
      <div class={s}>
        <For each={colors}>{(color) => <Swatch color={color} />}</For>
      </div>
    </Component>
  )
}
