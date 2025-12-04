import { deleteCar } from '~/client-api/query-action'
import { log } from '~/utils'
import { createEffect } from 'solid-js'
import Trash2 from 'lucide-solid/icons/trash-2'

export function DeleteCar(props: { id: number }) {
  // createEffect(() => {
  //   log('blue', 'DeleteCar|props:', props)
  // })
  return (
    <form action={deleteCar.with(props.id)} method="post">
      <button>
        <Trash2 />
      </button>
    </form>
  )
}
