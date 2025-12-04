import Trash2 from 'lucide-solid/icons/trash-2'
// import { DisplayUser } from '~/components/display-user'
// import { User } from '~/types'
import Users from '~/routes/users/(users)'

export function LIcon() {
    // bg-red-600 p-1 rounded-lg
  return (

    <button>
      <Trash2 />
    </button>
  )
}

export default function LucideIcon() {
  // const user:User = { id: 1, name: 'Test User', age: 30 }
  return (
    <>
      <div></div>
      <Users />
    </>
  )
}
