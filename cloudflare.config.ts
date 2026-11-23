export default {
  worker: {
    name: "startupmap",
    compatibilityDate: "2026-11-23",
    workersDev: true,
    assets: {
      notFoundHandling: "404-page",
    },
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
  },
}
