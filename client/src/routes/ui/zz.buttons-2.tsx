// import { For } from 'solid-js'
// import { Component } from '~/components/component/component'
// import { A } from '@solidjs/router'
// import { getAllButtonColors, type ButtonColors, type ButtonSizes } from '~/components/buttons/buttons'
// import { DeleteIcon } from '~/icons/delete-icon'

// export default function Buttons2() {

//   return (
//     <Component filename="src/routes/ui/buttons-2.tsx" isRouteRoot={true} title="ui>buttons-2">
//       <div class="p-8 space-y-8">
//         {/* Regular Buttons (shorthand classes: btn-{color}-{size}) */}
//         <section>
//           <h2 class="text-xl font-semibold mb-4">Regular Buttons</h2>
//           <div class="flex flex-wrap gap-4">
//             <For each={getAllButtonColors()}>
//               {(color: ButtonColors) => (
//                 <button class={`btn btn-${color} btn-sm`} type="button">{color} button</button>
//               )}
//             </For>
//           </div>
//         </section>

//         {/* Link Buttons */}
//         <section>
//           <h2 class="text-xl font-semibold mb-4">Link Buttons (shorthand)</h2>
//           <div class="flex flex-wrap gap-4">
//             <For each={getAllButtonColors()}>
//               {(color: ButtonColors) => (
//                 <A class={`btn-${color}-sm`} href="#">
//                   {color} link
//                 </A>
//               )}
//             </For>
//           </div>
//         </section>

//         {/* Icon Buttons */}
//         <section>
//           <h2 class="text-xl font-semibold mb-4">Icon Buttons (shorthand)</h2>
//           <div class="flex flex-wrap gap-4 mb-4">
//             <For each={getAllButtonColors()}>
//               {(color: ButtonColors) => (
//                 <button class={`btn-${color}-xs`} title={`${color} delete`} aria-label={`${color} delete`}>
//                   <span class="w-4 h-4 inline-block">
//                     <DeleteIcon />
//                   </span>
//                 </button>
//               )}
//             </For>
//           </div>

//           <div class="flex flex-wrap gap-4">
//             <For each={getAllButtonColors()}>
//               {(color: ButtonColors) => (
//                 <button class={`btn-${color}-xs`} title={`${color} edit`} aria-label={`${color} edit`}>
//                   <span class="w-4 h-4 inline-block">
//                     <EditIcon />
//                   </span>
//                 </button>
//               )}
//             </For>
//           </div>
//         </section>

//         {/* Button Sizes Example */}
//         <section>
//           <h2 class="text-xl font-semibold mb-4">Button Sizes</h2>
//           <div class="flex flex-wrap items-end gap-4">
//             <button class="btn btn-blue btn-xs" type="button">Extra Small</button>
//             <button class="btn btn-blue btn-sm" type="button">Small</button>
//             <button class="btn btn-blue btn-md" type="button">Medium</button>
//             <button class="btn btn-blue btn-lg" type="button">Large</button>
//           </div>
//         </section>

//         {/* Icon Button Sizes */}
//         <section>
//           <h2 class="text-xl font-semibold mb-4">Icon Button Sizes (shorthand)</h2>
//           <div class="flex flex-wrap items-center gap-4">
//             <button class="btn-gray-xs" aria-label="edit xs"><EditIcon /></button>
//             <button class="btn-gray-sm" aria-label="edit sm"><EditIcon /></button>
//             <button class="btn-gray-md" aria-label="edit md"><EditIcon /></button>
//             <button class="btn-gray-lg" aria-label="edit lg"><EditIcon /></button>
//           </div>
//         </section>
//       </div>
//     </Component>
//   )
// }
