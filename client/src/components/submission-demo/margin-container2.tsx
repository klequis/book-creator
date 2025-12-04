import { JSX } from 'solid-js'

interface MarginContainer2Props {
  children: JSX.Element
}

export default function MarginContainer2(props: MarginContainer2Props) {
  return (
    <div>
      {props.children}
    </div>
  )
}