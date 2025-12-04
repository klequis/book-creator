interface TextStrongDarkProps {
  children: string
}

export default function TextStrongDark(props: TextStrongDarkProps) {
  return (
    <strong>{props.children}</strong>
  )
}