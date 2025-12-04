// import type { User } from '~/types'
// import { DeleteIcon } from '~/icons/delete-icon'
// import { EditIcon } from '~/icons/edit-icon'
// import { DeleteIcon } from '~/icons/delete-icon'
// import { EditIcon } from '~/icons/edit-icon'

// type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

// function TWButton(props: { size: ButtonSize; color: string; text: string }) {
//   const size = {
//     xs: 'h-1',
//     sm: 'h-16',
//     md: 'h-24',
//     lg: 'h-32',
//   }
//   const s = `
//       flex
//       items-center
//       justify-center ${size[props.size]}
//       bg-${props.color}-500
//       text-white px-2
//       rounded
//       text-[0.6rem]
//       p-2
//     `
//   return <button class={s}>{props.text}</button>
// }

// const Box = (props: { height: string; color: string; type: string }) => {
//   // const s = `display: flex; align-items: center; height: ${props.height}; background-color: ${props.color};`

//   const st = `flex items-center h-2.5 bg-${props.color}-500 ${props.height}`
//   const sb = `flex items-center h-2.5 bg-${props.color}-500 ${props.height}`

//   if (props.type === 'text') {
//     return <div class={st}>A</div>
//   }
//   return <button class={sb}>B</button>
// }

// export function DisplayUser(props: { user: User }) {
//   const s = `display: flex; align-items: center; border: 1px solid white;`

//   return (
//     <div style={s}>
//       <Box height="h-40" color="red" type="text" />
//       <Box height="h-32" color="green" type="text" />
//       <Box height="h-20" color="blue" type="button" />
//       <TWButton size="xs" color="blue" text="Click me" />
//       <button class="btn-icon btn-green btn-md" type="button" title="Delete Button">
//         <DeleteIcon />
//       </button>
//       <button class="btn-icon btn-blue btn-md" type="button" title="Edit Button">
//         <EditIcon />
//       </button>
//       <button class="btn-icon btn-gray btn-md" type="submit" title="Edit Button">
//         <EditIcon />
//       </button>
//     </div>
//   )
// }
