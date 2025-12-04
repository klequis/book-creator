export function StateChangeHistoryCardHeader(props: {submissionHistoryLength: number}) {
  return (
    <div>
      <h3>Pending State Change History</h3>
      <small>
        {props.submissionHistoryLength} state transitions
      </small>
    </div>
  )
}
