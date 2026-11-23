import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

import globalStyle from "../styles/main.scss?url";
import nunitoStyle from '@fontsource-variable/nunito?url';

const getPublicMapboxToken = createServerFn({ method: 'GET' }).handler(() => {
  const token = env.MAPBOX_TOKEN
  return token?.startsWith('pk.') ? token : ''
})

export const Route = createRootRoute({
  loader: async () => ({ mapboxToken: await getPublicMapboxToken() }),
  head: () => ({
    meta: [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'Buffalo Startup Map',
    },
  ],
  links: [
    {
      rel: "icon",
      href: "/favicon.png",
    },
    {
      rel: "stylesheet",
      href: globalStyle
    },
    {
      rel: "stylesheet",
      href: nunitoStyle
    }
  ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div><h1>Not found</h1></div>
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
