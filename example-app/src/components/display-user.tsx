import { useSubmission } from '@solidjs/router'
import type { User } from '~/types'
import { deleteUser } from '~/client-api/query-action'
import { Link } from './link'
import { Show, createEffect, createSignal } from 'solid-js'
import Pencil from 'lucide-solid/icons/pencil'
import Trash2 from 'lucide-solid/icons/trash-2'

{
  /* <Trash2 /> */
}
export function DisplayUser(props: { user: User }) {
  const sub = useSubmission(deleteUser)
  const [deleting, setDeleting] = createSignal(
    sub.pending && props.user.id === (sub.input[0] as number)
  )

  // createEffect(() => {
  //   console.log('sub.pending:', sub.pending)
  //   console.log('sub.input:', sub.input)
  //   // const y = sub.input[0].get('id')

  // })

  // const isDeleting = () =>  sub.pending && props.user.id === sub.input[0] as number

  return (
    //* tbody > tr
    <tr>
      {/* //* tbody > tr > td */}
      <td>{props.user.id}</td>
      <td>
        <Link href={`/users/view/${props.user.id}`} text={props.user.name} />
      </td>
      <td>{props.user.age}</td>
      <td>
        {/* Constrain actions column width and keep buttons compact */}
        <div>
          <form action={deleteUser.with(props.user.id)} method="post">
            {/* <LIcon /> */}
            <button>
              <Trash2 />
            </button>
          </form>

          <Show when={deleting()}>
            <span>Deleting...</span>
          </Show>
        </div>
      </td>
    </tr>
  )
}
