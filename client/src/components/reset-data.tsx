import { resetData } from '~/client-api/query-action';
import type {DataCollections} from '~/types';

export function ResetData(props: { dataset: DataCollections }) {
  return (
    <form action={resetData.with(props.dataset)} method="post">
      <button type="submit">
        Reset Users
      </button>
    </form>
  )
}