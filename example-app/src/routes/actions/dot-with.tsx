import { log } from '~/utils'
import { deleteCar } from '~/client-api/query-action'
import { Component } from '~/components/component/component'
import { Button } from '~/components/buttons/button'
import { createSignal } from 'solid-js'

//! just say we already have one and go to delete-user.tsx

export default function DotWith() {
  const [carId, setCarId] = createSignal(1)
  // createEffect(() => {
  //   log('blue', 'DeleteUser|props:', props)
  // })
  return (
    <Component filename="actions/dot-with.tsx" isRouteRoot={true} title="`action.with`">
      <form action={deleteCar.with(carId())} method="post">
        <input name="carId" value={carId() ?? ''} />
        <button type="submit" >
          Delete Car 1
        </button>
      </form>
    </Component>
  )
}
