# Default starter for Gridsome

## Deploy Startup Map to Workers

Use Node 22 to build the static site, then deploy with `cf` 1.0.0-rc.3 or later.

```sh
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build
cf deploy ./dist
```

Set `GOOGLE_API_KEY_BE` in the build environment to refresh the map from Google Sheets. If Sheets is unavailable, the build uses [the published Startup Map snapshot](data/places.json) captured from Vercel on November 23, 2026. The map does not display contact emails, so the snapshot includes only the fields it uses.

Cloudflare publishes this deployment at `startupmap.jbhutch01.workers.dev`. The original `buffalostartupmap.com` hostname is served by a separate GitHub Pages deployment.

This is the project you get when you run `gridsome create new-project`.

### 1. Install Gridsome CLI tool if you don't have

`npm install --global @gridsome/cli`

### 2. Create a Gridsome project

1. `gridsome create my-gridsome-site` to install default starter
2. `cd my-gridsome-site` to open the folder
3. `gridsome develop` to start a local dev server at `http://localhost:8080`
4. Happy coding 🎉🙌

To run:

npm run develop
  Site running at:                                         
  - Local:                 http://localhost:8080/          
  - Network:               http://X:8080/
  - 
