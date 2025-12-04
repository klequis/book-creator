import { Alert } from '~/components/alert'
import { Component } from '~/components/component/component'

export function Alerts() {
  return (
    <Component filename="src/routes/ui/alerts.tsx" isRouteRoot={true} title="ui>alerts">
      <div>
        <section>
          <h2>Alerts</h2>
          <Alert mode="primary">
            This is a primary alert—check it out!
          </Alert>
          <Alert mode="success">
            This is a success alert—check it out!
          </Alert>
          <Alert mode="warning">
            This is a warning alert—check it out!
          </Alert>
          <Alert mode="danger">
            This is a danger alert—check it out!
          </Alert>
          <Alert mode="info">
            This is an info alert—check it out!
          </Alert>
        </section>
      </div>
    </Component>
  )
}