interface CodeTextDarkBoldProps {
  children: string
}

export default function CodeTextDarkBold(props: CodeTextDarkBoldProps) {
  return (
    <code>{props.children}</code>
  )
}