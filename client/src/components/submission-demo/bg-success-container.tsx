import { JSX } from 'solid-js'

interface BgSuccessContainerProps {
  children: JSX.Element
}

export default function BgSuccessContainer(props: BgSuccessContainerProps) {
  return (
    <div>
      {props.children}
    </div>
  )
}