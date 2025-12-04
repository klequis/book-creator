type Direction = "left" | "right" | "up" | "down"

export function OpenChevron(props: { 
  direction: Direction 
}) {
  const getRotation = () => {
    // rotate-270 does not work.
    const rotations = {
      right: 'rotate-none',
      down: 'rotate-90',
      left: 'rotate-180',
      up: '-rotate-90'
    }
    return rotations[props.direction]
  }

  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 5l7 7-7 7V5z"/>
    </svg>
  )
}
