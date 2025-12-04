import TextStrongDark from './text-strong-dark'

interface StateSectionProps {
  label: string
  children: any
  className?: string
}

export default function StateSection(props: StateSectionProps) {
  return (
    <div>
      <TextStrongDark>{props.label}:</TextStrongDark>
      {props.children}
    </div>
  )
}