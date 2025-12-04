interface TextStrongProps {
  children: string
  color?: 'success' | 'danger' | 'dark' | 'warning' | 'info'
  size?: 'small' | 'normal'
}

export default function TextStrong(props: TextStrongProps) {
  const colorClass = props.color ? `text-${props.color}` : 'text-dark'
  const sizeClass = props.size === 'small' ? 'small' : ''
  const classes = [colorClass, sizeClass].filter(Boolean).join(' ')
  
  return (
    <strong>{props.children}</strong>
  )
}