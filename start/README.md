# Buffalo Startup Map on TanStack Start

The map reads approved Airtable records. The public form keeps address autocomplete and sends submissions to Airtable with `status` set to `Pending`. Reviewers can edit the record in Airtable and set its status to `Approved` to publish it. Keep contact emails in Airtable for review. The map response includes only public listing fields.

## Prepare Airtable

1. Reconcile the live Google Sheet with the existing Startup Map base. Check duplicate or renamed listings and preserve the fields you want to publish.
2. Add a single-select field named `status` to the existing table, with options `Pending`, `Approved`, and `Rejected`. Mark reviewed existing listings `Approved`.
3. Add a grid view filtered to `Pending` for reviewers. Create an Airtable personal access token restricted to this base, with `data.records:read` and `data.records:write`.

Approved listings are cached for up to one hour at each Cloudflare location. Airtable's monthly API limit still applies.

## Develop locally

From this directory, run `pnpm install --frozen-lockfile`. In `.dev.vars`, supply `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`, and `MAPBOX_TOKEN`. Use a test table for form submissions.

Set `MAPBOX_TOKEN` in Cloudflare Worker settings on deployment. Use a public, read-only Mapbox token. The browser uses it for both tiles and autocomplete. Mapbox Permanent Geocoding must be available on that account to save selected addresses.

```sh
pnpm dev
pnpm build
pnpm typecheck
```

The TanStack Start app deploys to the existing `startupmap` Worker. Set the Airtable bindings before deploying. Run `pnpm exec cf deploy --dry-run` from this directory to check the build. After deployment, verify that a test submission appears in the Pending view and becomes visible only after approval before switching the public domain.
