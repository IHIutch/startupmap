# Buffalo Startup Map on TanStack Start

The map reads approved Airtable records. The public form keeps address autocomplete and sends submissions to Airtable with `status` set to `Pending`. Reviewers can edit the record in Airtable and set its status to `Approved` to publish it. Keep contact emails in Airtable for review. The map response includes only public listing fields.

## Prepare Airtable

1. Reconcile the live Google Sheet with the existing Startup Map base. Check duplicate or renamed listings and preserve the fields you want to publish.
2. Add a single-select field named `status` to the existing table, with options `Pending`, `Approved`, and `Rejected`. Mark reviewed existing listings `Approved`.
3. Add a grid view filtered to `Pending` for reviewers. Create an Airtable personal access token restricted to this base, with `data.records:read` and `data.records:write`.

Approved listings are cached for up to one hour at each Cloudflare location. Airtable's monthly API limit still applies.

## Develop locally

From this directory, run `pnpm install --frozen-lockfile`. In `.dev.vars`, supply `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`, `MAPBOX_TILE_TOKEN`, and `MAPBOX_GEOCODING_TOKEN`. Use a test table for form submissions.

Set the two Mapbox tokens as Cloudflare Worker secrets on deployment. `MAPBOX_TILE_TOKEN` must be a public, read-only token restricted to the site's domains in Mapbox. The browser uses it for direct tile requests. Use a separate least-privilege token for `MAPBOX_GEOCODING_TOKEN` that works from the Worker without a browser referrer. Mapbox Permanent Geocoding must be available on that account to save selected addresses.

```sh
pnpm dev
pnpm build
pnpm typecheck
```

The Worker is named `startupmap-tanstack`. To publish a verified preview, set the Airtable bindings on that Worker and deploy with `pnpm exec cf deploy` from this directory. Switch the public domain after checking the map and confirming that a test submission appears in the Pending view and becomes visible only after approval.
