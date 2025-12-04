// import { createSignal, onMount } from 'solid-js'
// For saving data
/*
    - https://coolors.co/0ea5e9/palettes
*/

// type Color = { name: string; hex: string }

// const colors = [
//   { name: 'blue', hex: '#0EA5E9' },
//   { name: 'blue2', hex: '#2669a3' },
//   { name: 'blue3', hex: '#0284c7' },
//   { name: 'green', hex: '#10b981' },
//   { name: 'red', hex: '#E9100E' },
//   { name: 'amber', hex: '#fbbf24' },
//   { name: 'darkOrange', hex: '#E9940E' },
//   { name: 'darkViolet', hex: '#8B0EE9' },
//   { name: 'magenta', hex: '#E70EE9' },
//   { name: 'deepPink', hex: '#E90E8F' },
//   { name: 'crimson', hex: '#E90E33' },
//   { name: 'orangeRed', hex: '#E9450E' },
//   { name: 'orange', hex: '#E9A10E' },
// ]

function Swatch({
  name,
  bgColor,
  txtColor,
}: {
  name: string
  bgColor: string
  txtColor: string
}) {
  return (
    <div>
      {name}
    </div>
  )
}

function Tint(props: {name: string, color:string, bgColor: string }) {
  return (
    <div>
      {props.name}
    </div>
  )
}

export function Colors() {
  return (
    <div>
      <h2>Color Swatches</h2>
      <div>
        <Swatch
          name="Primary Blue"
          bgColor="var(--primary-blue)"
          txtColor="var(--white)"
        />
        <Swatch name="Safe" bgColor="var(--safe)" txtColor="var(--white)" />
        <Swatch
          name="Warning"
          bgColor="var(--warning)"
          txtColor="var(--white)"
        />
        <Swatch name="Danger" bgColor="var(--danger)" txtColor="var(--white)" />
      </div>
      <h2>Color Tints</h2>
      <div
        id="tint-container"
      >
        <Tint name="gray-dark" color="var(--white)" bgColor="var(--gray-dark)" />
        <Tint name="gray-medium" color="var(--white)" bgColor="var(--gray-medium)" />
        <Tint name="gray-medium-light" color="var(--gray-dark)" bgColor="var(--gray-medium-light)" />
        <Tint name="gray-light" color="var(--gray-dark)" bgColor="var(--gray-light)" />
      </div>
    </div>
  )
}
