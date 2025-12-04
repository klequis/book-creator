import { A } from '@solidjs/router'

export function Link(props: { href: string; text: string }) {
  return (
    <A href={props.href}>
      {props.text}
    </A>
  )
}
