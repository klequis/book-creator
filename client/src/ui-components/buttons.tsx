import { createEffect, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import Trash2 from 'lucide-solid/icons/trash-2'
import CircleAlert from 'lucide-solid/icons/circle-alert'
import ThumbsUp from 'lucide-solid/icons/thumbs-up'
import { Test1 } from '~/components/test/test1'
import { Test2 } from '~/components/test/test2'

export function Buttons() {
  const [active, setActive] = createSignal(false)
  createEffect(() => {
    // setActive(!active())
    console.log('toggleActive:', active())
  })

  return (
    <>
      <h2>Buttons</h2>
      <div class="button-row">
        <button class="btn btn-success btn-xs">Success (xs)</button>
        <button class="btn btn-success btn-sm">Success (sm)</button>
        <button class="btn btn-success btn-md">Success (md)</button>
        <button class="btn btn-success btn-lg">Success (lg)</button>
      </div>
      <div class="button-row">
        <button class="btn btn-warn btn-xs">Warn (xs)</button>
        <button class="btn btn-warn btn-sm">Warn (sm)</button>
        <button class="btn btn-warn btn-md">Warn (md)</button>
        <button class="btn btn-warn btn-lg">Warn (lg)</button>
      </div>
      <div class="button-row">
        <button class="btn btn-danger btn-xs">Danger (xs)</button>
        <button class="btn btn-danger btn-sm">Danger (sm)</button>
        <button class="btn btn-danger btn-md">Danger (md)</button>
        <button class="btn btn-danger btn-lg">Danger (lg)</button>
      </div>
      <div class="button-row">
        <A href="#" class="btn-link btn-success btn-xs">
          Link xs
        </A>
        <A href="#" class="btn-link btn-success btn-sm">
          Link sm
        </A>
        <A href="#" class="btn-link btn-warn btn-md">
          Link md
        </A>
        <A href="#" class="btn-link btn-danger btn-lg">
          Link lg
        </A>
      </div>
      <div class="button-row">
        <button class="btn-icon btn-success btn-xs">
          <ThumbsUp />
        </button>
        <button class="btn-icon btn-success btn-md">
          <ThumbsUp />
        </button>
        <button class="btn-icon btn-success btn-lg">
          <ThumbsUp />
        </button>
        <button class="btn-icon btn-warn btn-xs">
          <CircleAlert />
        </button>
        <button class="btn-icon btn-warn btn-md">
          <CircleAlert />
        </button>
        <button class="btn-icon btn-warn btn-lg">
          <CircleAlert />
        </button>
        <button class="btn-icon btn-danger btn-xs">
          <Trash2 />
        </button>
        <button class="btn-icon btn-danger btn-md">
          <Trash2 />
        </button>
        <button class="btn-icon btn-danger btn-lg">
          <Trash2 />
        </button>
      </div>
    </>
  )
}
