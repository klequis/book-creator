import { For } from 'solid-js'
import { Component } from '~/components/component/component'

type Color = {
  name: string
  value: string
}

type ColorGroup = {
  name: string
  colors: Color[]
}

const specialColors: Color[] = [
  { name: 'inherit', value: 'bg-inherit' },
  { name: 'current', value: 'bg-current' },
  { name: 'transparent', value: 'bg-transparent' },
  { name: 'black', value: 'bg-black' },
  { name: 'white', value: 'bg-white' },
]

const colorGroups: ColorGroup[] = [
  {
    name: 'Red',
    colors: [
      { name: '50', value: 'bg-red-50' },
      { name: '100', value: 'bg-red-100' },
      { name: '200', value: 'bg-red-200' },
      { name: '300', value: 'bg-red-300' },
      { name: '400', value: 'bg-red-400' },
      { name: '500', value: 'bg-red-500' },
      { name: '600', value: 'bg-red-600' },
      { name: '700', value: 'bg-red-700' },
      { name: '800', value: 'bg-red-800' },
      { name: '900', value: 'bg-red-900' },
      { name: '950', value: 'bg-red-950' },
    ],
  },
  {
    name: 'Orange',
    colors: [
      { name: '50', value: 'bg-orange-50' },
      { name: '100', value: 'bg-orange-100' },
      { name: '200', value: 'bg-orange-200' },
      { name: '300', value: 'bg-orange-300' },
      { name: '400', value: 'bg-orange-400' },
      { name: '500', value: 'bg-orange-500' },
      { name: '600', value: 'bg-orange-600' },
      { name: '700', value: 'bg-orange-700' },
      { name: '800', value: 'bg-orange-800' },
      { name: '900', value: 'bg-orange-900' },
      { name: '950', value: 'bg-orange-950' },
    ],
  },
  {
    name: 'Amber',
    colors: [
      { name: '50', value: 'bg-amber-50' },
      { name: '100', value: 'bg-amber-100' },
      { name: '200', value: 'bg-amber-200' },
      { name: '300', value: 'bg-amber-300' },
      { name: '400', value: 'bg-amber-400' },
      { name: '500', value: 'bg-amber-500' },
      { name: '600', value: 'bg-amber-600' },
      { name: '700', value: 'bg-amber-700' },
      { name: '800', value: 'bg-amber-800' },
      { name: '900', value: 'bg-amber-900' },
      { name: '950', value: 'bg-amber-950' },
    ],
  },
  {
    name: 'Yellow',
    colors: [
      { name: '50', value: 'bg-yellow-50' },
      { name: '100', value: 'bg-yellow-100' },
      { name: '200', value: 'bg-yellow-200' },
      { name: '300', value: 'bg-yellow-300' },
      { name: '400', value: 'bg-yellow-400' },
      { name: '500', value: 'bg-yellow-500' },
      { name: '600', value: 'bg-yellow-600' },
      { name: '700', value: 'bg-yellow-700' },
      { name: '800', value: 'bg-yellow-800' },
      { name: '900', value: 'bg-yellow-900' },
      { name: '950', value: 'bg-yellow-950' },
    ],
  },
  {
    name: 'Lime',
    colors: [
      { name: '50', value: 'bg-lime-50' },
      { name: '100', value: 'bg-lime-100' },
      { name: '200', value: 'bg-lime-200' },
      { name: '300', value: 'bg-lime-300' },
      { name: '400', value: 'bg-lime-400' },
      { name: '500', value: 'bg-lime-500' },
      { name: '600', value: 'bg-lime-600' },
      { name: '700', value: 'bg-lime-700' },
      { name: '800', value: 'bg-lime-800' },
      { name: '900', value: 'bg-lime-900' },
      { name: '950', value: 'bg-lime-950' },
    ],
  },
  {
    name: 'Green',
    colors: [
      { name: '50', value: 'bg-green-50' },
      { name: '100', value: 'bg-green-100' },
      { name: '200', value: 'bg-green-200' },
      { name: '300', value: 'bg-green-300' },
      { name: '400', value: 'bg-green-400' },
      { name: '500', value: 'bg-green-500' },
      { name: '600', value: 'bg-green-600' },
      { name: '700', value: 'bg-green-700' },
      { name: '800', value: 'bg-green-800' },
      { name: '900', value: 'bg-green-900' },
      { name: '950', value: 'bg-green-950' },
    ],
  },
  {
    name: 'Emerald',
    colors: [
      { name: '50', value: 'bg-emerald-50' },
      { name: '100', value: 'bg-emerald-100' },
      { name: '200', value: 'bg-emerald-200' },
      { name: '300', value: 'bg-emerald-300' },
      { name: '400', value: 'bg-emerald-400' },
      { name: '500', value: 'bg-emerald-500' },
      { name: '600', value: 'bg-emerald-600' },
      { name: '700', value: 'bg-emerald-700' },
      { name: '800', value: 'bg-emerald-800' },
      { name: '900', value: 'bg-emerald-900' },
      { name: '950', value: 'bg-emerald-950' },
    ],
  },
  {
    name: 'Teal',
    colors: [
      { name: '50', value: 'bg-teal-50' },
      { name: '100', value: 'bg-teal-100' },
      { name: '200', value: 'bg-teal-200' },
      { name: '300', value: 'bg-teal-300' },
      { name: '400', value: 'bg-teal-400' },
      { name: '500', value: 'bg-teal-500' },
      { name: '600', value: 'bg-teal-600' },
      { name: '700', value: 'bg-teal-700' },
      { name: '800', value: 'bg-teal-800' },
      { name: '900', value: 'bg-teal-900' },
      { name: '950', value: 'bg-teal-950' },
    ],
  },
  {
    name: 'Cyan',
    colors: [
      { name: '50', value: 'bg-cyan-50' },
      { name: '100', value: 'bg-cyan-100' },
      { name: '200', value: 'bg-cyan-200' },
      { name: '300', value: 'bg-cyan-300' },
      { name: '400', value: 'bg-cyan-400' },
      { name: '500', value: 'bg-cyan-500' },
      { name: '600', value: 'bg-cyan-600' },
      { name: '700', value: 'bg-cyan-700' },
      { name: '800', value: 'bg-cyan-800' },
      { name: '900', value: 'bg-cyan-900' },
      { name: '950', value: 'bg-cyan-950' },
    ],
  },
  {
    name: 'Sky',
    colors: [
      { name: '50', value: 'bg-sky-50' },
      { name: '100', value: 'bg-sky-100' },
      { name: '200', value: 'bg-sky-200' },
      { name: '300', value: 'bg-sky-300' },
      { name: '400', value: 'bg-sky-400' },
      { name: '500', value: 'bg-sky-500' },
      { name: '600', value: 'bg-sky-600' },
      { name: '700', value: 'bg-sky-700' },
      { name: '800', value: 'bg-sky-800' },
      { name: '900', value: 'bg-sky-900' },
      { name: '950', value: 'bg-sky-950' },
    ],
  },
  {
    name: 'Blue',
    colors: [
      { name: '50', value: 'bg-blue-50' },
      { name: '100', value: 'bg-blue-100' },
      { name: '200', value: 'bg-blue-200' },
      { name: '300', value: 'bg-blue-300' },
      { name: '400', value: 'bg-blue-400' },
      { name: '500', value: 'bg-blue-500' },
      { name: '600', value: 'bg-blue-600' },
      { name: '700', value: 'bg-blue-700' },
      { name: '800', value: 'bg-blue-800' },
      { name: '900', value: 'bg-blue-900' },
      { name: '950', value: 'bg-blue-950' },
    ],
  },
  {
    name: 'Indigo',
    colors: [
      { name: '50', value: 'bg-indigo-50' },
      { name: '100', value: 'bg-indigo-100' },
      { name: '200', value: 'bg-indigo-200' },
      { name: '300', value: 'bg-indigo-300' },
      { name: '400', value: 'bg-indigo-400' },
      { name: '500', value: 'bg-indigo-500' },
      { name: '600', value: 'bg-indigo-600' },
      { name: '700', value: 'bg-indigo-700' },
      { name: '800', value: 'bg-indigo-800' },
      { name: '900', value: 'bg-indigo-900' },
      { name: '950', value: 'bg-indigo-950' },
    ],
  },
  {
    name: 'Violet',
    colors: [
      { name: '50', value: 'bg-violet-50' },
      { name: '100', value: 'bg-violet-100' },
      { name: '200', value: 'bg-violet-200' },
      { name: '300', value: 'bg-violet-300' },
      { name: '400', value: 'bg-violet-400' },
      { name: '500', value: 'bg-violet-500' },
      { name: '600', value: 'bg-violet-600' },
      { name: '700', value: 'bg-violet-700' },
      { name: '800', value: 'bg-violet-800' },
      { name: '900', value: 'bg-violet-900' },
      { name: '950', value: 'bg-violet-950' },
    ],
  },
  {
    name: 'Purple',
    colors: [
      { name: '50', value: 'bg-purple-50' },
      { name: '100', value: 'bg-purple-100' },
      { name: '200', value: 'bg-purple-200' },
      { name: '300', value: 'bg-purple-300' },
      { name: '400', value: 'bg-purple-400' },
      { name: '500', value: 'bg-purple-500' },
      { name: '600', value: 'bg-purple-600' },
      { name: '700', value: 'bg-purple-700' },
      { name: '800', value: 'bg-purple-800' },
      { name: '900', value: 'bg-purple-900' },
      { name: '950', value: 'bg-purple-950' },
    ],
  },
  {
    name: 'Fuchsia',
    colors: [
      { name: '50', value: 'bg-fuchsia-50' },
      { name: '100', value: 'bg-fuchsia-100' },
      { name: '200', value: 'bg-fuchsia-200' },
      { name: '300', value: 'bg-fuchsia-300' },
      { name: '400', value: 'bg-fuchsia-400' },
      { name: '500', value: 'bg-fuchsia-500' },
      { name: '600', value: 'bg-fuchsia-600' },
      { name: '700', value: 'bg-fuchsia-700' },
      { name: '800', value: 'bg-fuchsia-800' },
      { name: '900', value: 'bg-fuchsia-900' },
      { name: '950', value: 'bg-fuchsia-950' },
    ],
  },
  {
    name: 'Pink',
    colors: [
      { name: '50', value: 'bg-pink-50' },
      { name: '100', value: 'bg-pink-100' },
      { name: '200', value: 'bg-pink-200' },
      { name: '300', value: 'bg-pink-300' },
      { name: '400', value: 'bg-pink-400' },
      { name: '500', value: 'bg-pink-500' },
      { name: '600', value: 'bg-pink-600' },
      { name: '700', value: 'bg-pink-700' },
      { name: '800', value: 'bg-pink-800' },
      { name: '900', value: 'bg-pink-900' },
      { name: '950', value: 'bg-pink-950' },
    ],
  },
  {
    name: 'Rose',
    colors: [
      { name: '50', value: 'bg-rose-50' },
      { name: '100', value: 'bg-rose-100' },
      { name: '200', value: 'bg-rose-200' },
      { name: '300', value: 'bg-rose-300' },
      { name: '400', value: 'bg-rose-400' },
      { name: '500', value: 'bg-rose-500' },
      { name: '600', value: 'bg-rose-600' },
      { name: '700', value: 'bg-rose-700' },
      { name: '800', value: 'bg-rose-800' },
      { name: '900', value: 'bg-rose-900' },
      { name: '950', value: 'bg-rose-950' },
    ],
  },
  {
    name: 'Slate',
    colors: [
      { name: '50', value: 'bg-slate-50' },
      { name: '100', value: 'bg-slate-100' },
      { name: '200', value: 'bg-slate-200' },
      { name: '300', value: 'bg-slate-300' },
      { name: '400', value: 'bg-slate-400' },
      { name: '500', value: 'bg-slate-500' },
      { name: '600', value: 'bg-slate-600' },
      { name: '700', value: 'bg-slate-700' },
      { name: '800', value: 'bg-slate-800' },
      { name: '900', value: 'bg-slate-900' },
      { name: '950', value: 'bg-slate-950' },
    ],
  },
  {
    name: 'Gray',
    colors: [
      { name: '50', value: 'bg-gray-50' },
      { name: '100', value: 'bg-gray-100' },
      { name: '200', value: 'bg-gray-200' },
      { name: '300', value: 'bg-gray-300' },
      { name: '400', value: 'bg-gray-400' },
      { name: '500', value: 'bg-gray-500' },
      { name: '600', value: 'bg-gray-600' },
      { name: '700', value: 'bg-gray-700' },
      { name: '800', value: 'bg-gray-800' },
      { name: '900', value: 'bg-gray-900' },
      { name: '950', value: 'bg-gray-950' },
    ],
  },
  {
    name: 'Zinc',
    colors: [
      { name: '50', value: 'bg-zinc-50' },
      { name: '100', value: 'bg-zinc-100' },
      { name: '200', value: 'bg-zinc-200' },
      { name: '300', value: 'bg-zinc-300' },
      { name: '400', value: 'bg-zinc-400' },
      { name: '500', value: 'bg-zinc-500' },
      { name: '600', value: 'bg-zinc-600' },
      { name: '700', value: 'bg-zinc-700' },
      { name: '800', value: 'bg-zinc-800' },
      { name: '900', value: 'bg-zinc-900' },
      { name: '950', value: 'bg-zinc-950' },
    ],
  },
  {
    name: 'Neutral',
    colors: [
      { name: '50', value: 'bg-neutral-50' },
      { name: '100', value: 'bg-neutral-100' },
      { name: '200', value: 'bg-neutral-200' },
      { name: '300', value: 'bg-neutral-300' },
      { name: '400', value: 'bg-neutral-400' },
      { name: '500', value: 'bg-neutral-500' },
      { name: '600', value: 'bg-neutral-600' },
      { name: '700', value: 'bg-neutral-700' },
      { name: '800', value: 'bg-neutral-800' },
      { name: '900', value: 'bg-neutral-900' },
      { name: '950', value: 'bg-neutral-950' },
    ],
  },
  {
    name: 'Stone',
    colors: [
      { name: '50', value: 'bg-stone-50' },
      { name: '100', value: 'bg-stone-100' },
      { name: '200', value: 'bg-stone-200' },
      { name: '300', value: 'bg-stone-300' },
      { name: '400', value: 'bg-stone-400' },
      { name: '500', value: 'bg-stone-500' },
      { name: '600', value: 'bg-stone-600' },
      { name: '700', value: 'bg-stone-700' },
      { name: '800', value: 'bg-stone-800' },
      { name: '900', value: 'bg-stone-900' },
      { name: '950', value: 'bg-stone-950' },
    ],
  },
]

function Swatch(props: { color: Color }) {
  const textColor =
    props.color.name.startsWith('50') ||
    props.color.name.startsWith('100') ||
    props.color.name.startsWith('200') ||
    props.color.name.startsWith('300') ||
    props.color.name === 'white' ||
    props.color.name === 'transparent'
      ? 'text-gray-900'
      : 'text-white'

  const c = `${props.color.value} w-12 h-8 text-xs ${textColor} font-medium flex items-center justify-center px-2 px-1`
  return (
    <div class={c}>
      <div>{props.color.name}</div>
    </div>
  )
}

function SpecialSwatch(props: { color: Color }) {
  const textColor =
    props.color.name === 'white' || props.color.name === 'transparent'
      ? 'text-gray-900'
      : 'text-white'

  const c = `${props.color.value} w-24 h-8 text-xs ${textColor} font-medium flex items-center justify-center border border-gray-200`
  return (
    <div class={c}>
      <div>{props.color.name}</div>
    </div>
  )
}

function ColorGroup(props: { group: ColorGroup }) {
  return (
    <div class="mb-6">
      <div class="text-sm font-medium mb-2">{props.group.name}</div>
      <div class="flex flex-wrap gap-1">
        <For each={props.group.colors}>
          {(color) => <Swatch color={color} />}
        </For>
      </div>
    </div>
  )
}

export default function Colors() {
  // style={{backgroundColor:`${color}`}}
  return (
    <Component filename="src/routes/ui/colors-2.tsx" isRouteRoot={true} title="ui>colors-2">
      <div class="p-4">
        <div class="mb-8">
          <div class="text-sm font-medium mb-2">Special Colors</div>
          <div class="flex flex-wrap gap-1">
            <For each={specialColors}>
              {(color) => <SpecialSwatch color={color} />}
            </For>
          </div>
        </div>
        <For each={colorGroups}>{(group) => <ColorGroup group={group} />}</For>
      </div>
    </Component>
  )
}
