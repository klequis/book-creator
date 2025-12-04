interface StrongSmallSuccessProps {
  children: string
}

export default function StrongSmallSuccess(props: StrongSmallSuccessProps) {
  return (
    <strong>{props.children}</strong>
  )
}