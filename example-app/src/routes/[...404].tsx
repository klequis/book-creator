import { Title } from '@solidjs/meta'
import { HttpStatusCode } from '@solidjs/start'
import { Component } from '~/components/component/component'

import { PageTitle } from '~/components/page-title'

export default function NotFound() {
  return (
    <Component filename="[...404].tsx" isRouteRoot={true} title="404 Not Found">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <PageTitle text="Page Not Found" />
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </Component>
  )
}
