import { env } from 'cloudflare:workers'
import { z } from 'zod'
import { publicListingSchema } from './schemas'
import type { PublicListing, StartupSubmission } from './schemas'

const listingFields = Object.keys(publicListingSchema.shape).filter(field => field !== 'id')

const pageSchema = z.object({
  records: z.array(z.object({ id: z.string(), fields: z.record(z.unknown()) })),
  offset: z.string().optional(),
})

async function airtableRequest(query: URLSearchParams, init?: RequestInit) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = env
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    throw new Error('Startup Map storage is not configured.')
  }
  const url = new URL('https://api.airtable.com/v0/')
  url.pathname += [AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID].map(encodeURIComponent).join('/')
  url.search = query.toString()
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: 'Bearer ' + AIRTABLE_API_KEY,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) throw new Error('Startup Map storage returned HTTP ' + response.status + '.')
  return response
}

export async function getApprovedStartups(cacheKey: Request): Promise<PublicListing[]> {
  const cache = await caches.open('startupmap-airtable-v1')
  const cached = await cache.match(cacheKey)
  if (cached) return cached.json()

  const query = new URLSearchParams({ filterByFormula: '{status} = "Approved"', pageSize: '100' })
  for (const field of listingFields) query.append('fields[]', field)

  const listings: PublicListing[] = []
  let offset: string | undefined
  do {
    if (offset) query.set('offset', offset)
    const response = await airtableRequest(query)
    const page = pageSchema.parse(await response.json())
    for (const { id, fields } of page.records) {
      const parsed = publicListingSchema.safeParse({ description: '', website: '', ...fields, id })
      if (parsed.success) listings.push(parsed.data)
    }
    offset = page.offset
  } while (offset)

  await cache.put(cacheKey, Response.json(listings, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  }))
  return listings
}

export async function submitStartup(submission: StartupSubmission) {
  await airtableRequest(new URLSearchParams(), {
    method: 'POST',
    body: JSON.stringify({
      typecast: true,
      fields: { ...submission, address: JSON.stringify(submission.address), status: 'Pending' },
    }),
  })
}
