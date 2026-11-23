import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import globalStyle from "../styles/main.scss?url";
import nunitoStyle from '@fontsource-variable/nunito?url';

export const Route = createRootRoute({
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
