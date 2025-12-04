export default function Fatal(props: { error: Error }) {
  return (
    <div>
      <h1>Fatal Error</h1>
      <p>{props.error.message}</p>
    </div>
  )
}