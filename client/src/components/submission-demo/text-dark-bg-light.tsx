interface TextDarkBgLightProps {
  children: string
}

export default function TextDarkBgLight(props: TextDarkBgLightProps) {
  return (
    <code>{props.children}</code>
  )
}