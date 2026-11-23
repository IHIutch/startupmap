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
      MAPBOX_TILE_TOKEN: bindings.secret(),
      MAPBOX_GEOCODING_TOKEN: bindings.secret(),
      MAPBOX_SUGGEST_LIMIT: bindings.rateLimit({ namespace: '878782589', simple: { limit: 60, period: 60 } }),
      MAPBOX_RESOLVE_LIMIT: bindings.rateLimit({ namespace: '878782590', simple: { limit: 10, period: 60 } }),
    },
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
  },
})
