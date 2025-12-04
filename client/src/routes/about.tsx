import { Title } from '@solidjs/meta'
import { Component } from '~/components/component/component'
import { PageTitle } from '~/components/page-title'

export default function About() {
  return (
    <Component filename="about.tsx" isRouteRoot={true} title='About'>
      <Title>About</Title>
    </Component>
  )
}
