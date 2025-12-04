import { JSX } from 'solid-js'

interface AlertWarningProps {
  children: JSX.Element
}

export default function AlertWarning(props: AlertWarningProps) {
  return (
    <div >
      {props.children}
    </div>
  )
}