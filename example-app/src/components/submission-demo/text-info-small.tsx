import { JSX } from 'solid-js'

interface TextInfoSmallProps {
  children: JSX.Element
  marginBottom?: '1' | '2'
}

export default function TextInfoSmall(props: TextInfoSmallProps) {
  const mbClass = props.marginBottom ? `mb-${props.marginBottom}` : 'mb-1'
  
  return (
    <div>
      {props.children}
    </div>
  )
}