import { bindings, defineConfig } from 'cf/config'

export default defineConfig({
  worker: {
    name: 'startupmap-tanstack',
    compatibilityDate: '2026-11-23',
    entrypoint: './app/server.ts',
    env: {
      AIRTABLE_API_KEY: bindings.secret(),
      AIRTABLE_BASE_ID: bindings.secret(),
      AIRTABLE_TABLE_ID: bindings.secret(),
      MAPBOX_TOKEN: bindings.secret(),
    },
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
  },
})
