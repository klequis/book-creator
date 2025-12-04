interface BgDangerContainerProps {
  message: string
  className?: string
}

export default function BgDangerContainer(props: BgDangerContainerProps) {
  return (
    <div >
      <strong>
        {props.message}
      </strong>
    </div>
  )
}