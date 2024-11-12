import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'

import globalStyle from "../styles/main.scss?url";
import nunitoStyle from '@fontsource-variable/nunito?url';

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  links: () => [
    {
      rel: "stylesheet",
      href: globalStyle
    },
    {
      rel: "stylesheet",
      href: nunitoStyle
    }
  ],
  component: RootComponent,
  notFoundComponent: () => <div><h1>Not found</h1></div>
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
