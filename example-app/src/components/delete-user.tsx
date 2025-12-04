import { deleteUser } from '~/client-api/query-action'
import { log } from '~/utils'
import { createEffect, Match, Switch } from 'solid-js'

// import { useSubmission } from '@solidjs/router'
// import { Alert } from './alert'

export function DeleteUser(props: { id: number }) {
  // createEffect(() => {
  //   log('blue', 'DeleteUser|props:', props)
  // })
  return (
    <form action={deleteUser.with(props.id)} method="post">
      <button type="submit">
        Delete
      </button>
    </form>
  )
}

