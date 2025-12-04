import styles from './breakpoint.module.css';
// const pad = "padding: 2rem"
// const a =`xs:bg-red md:${pad}`
export default function Breakpoint() {
  return (
    <div>
      <span class={`xs:bg-red xs:junk`}>xs</span>
      <span class={`sm:bg-orange`}>sm</span>
      <span class={`md:bg-green`}>md</span>
      <span class={`lg:bg-blue`}>lg</span>
      <span class={`xl:bg-purple`}>xl</span>
    </div>
  )
}
