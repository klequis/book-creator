import { JSX } from 'solid-js'

interface MarginContainerProps {
  children: JSX.Element
}

export default function MarginContainer(props: MarginContainerProps) {
  return (
    <div>
      {props.children}
    </div>
  )
}