import { JSX, splitProps } from 'solid-js'

interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether this is a checkbox/radio label
   * @default false
   */
  check?: boolean
  /**
   * Additional CSS classes to apply
   */
  class?: string
  /**
   * Label text content
   */
  text: string
}


export default function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ['check', 'class', 'text'])
  
  
  return (
    <label>
      {local.text}
    </label>
  )
}