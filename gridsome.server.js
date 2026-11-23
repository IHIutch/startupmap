// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const snapshot = require("./data/places.json")
const fields = Object.keys(snapshot[0]).filter(field => field !== "id")

async function loadPlaces() {
  const key = process.env.GOOGLE_API_KEY_BE
  if (!key) return snapshot

  try {
    const url = new URL("https://sheets.googleapis.com/v4/spreadsheets/14uU2zJQlJgU7zDniRZ7UUlIKvT4sT2lIWO-Zzo-hJmg/values/Sheet1")
    url.searchParams.set("key", key)
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!response.ok) throw new Error("Sheets request failed")

    const { values: [headers, ...rows] } = await response.json()
    const columns = fields.map(field => headers.indexOf(field))
    if (!rows.length || columns.includes(-1)) throw new Error("Unexpected Sheets columns")

    return rows.map((row, id) => ({
      id,
      ...Object.fromEntries(fields.map((field, index) => [field, row[columns[index]] ?? null])),
    }))
  } catch {
    console.warn("Google Sheets is unavailable. Building Startup Map from the published snapshot.")
    return snapshot
  }
}

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    const places = addCollection("places")
    for (const place of await loadPlaces()) {
      places.addNode(place)
    }
  })
}
