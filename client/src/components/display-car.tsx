import type { Car } from '~/types'
import { Link } from './link'
// import { DeleteCar } from './delete-car'
// import { logFn, log } from '~/utils'

export function DisplayCar(props: { car: Car }) {
  return (
    <tr >
      <td >{props.car.id}</td>
      <td >
        <Link href={`/cars/view/${props.car.id}`} text={`${props.car.make} ${props.car.model}`} />
      </td>
      <td >{props.car.year}</td>
      <td >{props.car.miles.toLocaleString()}</td>
    </tr>
  )
}