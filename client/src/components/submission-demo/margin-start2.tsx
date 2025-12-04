import { JSX } from 'solid-js'

interface MarginStart2Props {
  children: JSX.Element
}

export default function MarginStart2(props: MarginStart2Props) {
  return (
    <div>
      {props.children}
    </div>
  )
}