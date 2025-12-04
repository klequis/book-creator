import { JSX, ParentProps } from 'solid-js'

interface ButtonBarProps extends ParentProps {
  /**
   * Items to display on the left side of the button bar
   */
  left?: JSX.Element
  /**
   * Items to display on the right side of the button bar
   */
  right?: JSX.Element
  /**
   * Additional CSS classes
   */
  class?: string
}

export function ButtonBar(props: ButtonBarProps) {
  return (
    <div>
      <div>
        {props.left}
      </div>
      <div>
        {props.right}
      </div>
    </div>
  )
}
