import type { ParentProps } from 'solid-js'

type Mode = 'primary' | "success" | "warning" | "danger" | "info"

export function Alert(props: ParentProps & { mode?: Mode }) {
  const mode = props.mode || 'primary'
  
  const getAlertClasses = () => {
    const baseClasses = 'px-4 py-3 rounded-md border mb-4 font-medium'
    
    switch (mode) {
      case 'success':
        return `${baseClasses} bg-green-100 border-green-500 text-green-700`
      case 'warning':
        return `${baseClasses} bg-yellow-100 border-yellow-500 text-yellow-700`
      case 'danger':
        return `${baseClasses} bg-red-100 border-red-500 text-red-700`
      case 'info':
        return `${baseClasses} bg-blue-100 border-blue-500 text-blue-700`
      case 'primary':
      default:
        return `${baseClasses} bg-indigo-100 border-indigo-500 text-indigo-700`
    }
  }
  
  return (
    <div>
      {props.children}
    </div>
  )
}