import { env } from 'cloudflare:workers'
import { z } from 'zod'
import type { AddressType } from './schemas'

const collectionSchema = z.object({ features: z.array(z.unknown()) })
const suggestionSchema = z.object({
  properties: z.object({
    mapbox_id: z.string().min(1),
    full_address: z.string().min(1),
  }),
})
const namedContext = z.object({ name: z.string() }).optional()
const addressFeatureSchema = z.object({
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  }),
  properties: z.object({
    mapbox_id: z.string(),
    context: z.object({
      address: z.object({ address_number: z.string(), street_name: z.string() }),
      neighborhood: namedContext,
      place: namedContext,
      locality: namedContext,
      district: namedContext,
      region: namedContext,
      country: namedContext,
      postcode: namedContext,
    }),
  }),
})

type Suggestion = z.infer<typeof suggestionSchema>['properties']
type Place = { address: AddressType; lat: number; lng: number }

export function getPublicTileToken() {
  const token = env.MAPBOX_TILE_TOKEN
  return token?.startsWith('pk.') ? token : ''
}

async function geocode(params: Record<string, string>, request: Request, rateLimit: RateLimit) {
  const accessToken = env.MAPBOX_GEOCODING_TOKEN
  if (!accessToken) throw new Error('Address search is not configured.')

  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const { success } = await rateLimit.limit({ key })
  if (!success) throw new Error('Too many address lookups. Try again in a minute.')

  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.search = new URLSearchParams({ ...params, access_token: accessToken }).toString()
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(8_000)]),
    })
    if (!response.ok) throw new Error('Unexpected Mapbox response.')
    return collectionSchema.parse(await response.json()).features
  } catch {
    throw new Error('Mapbox geocoding failed.')
  }
}

export async function searchAddresses(query: string, request: Request): Promise<Suggestion[]> {
  const features = await geocode({
    q: query,
    autocomplete: 'true',
    proximity: '-78.8784,42.8864',
    types: 'address',
    limit: '5',
  }, request, env.MAPBOX_SUGGEST_LIMIT)

  return features.flatMap(feature => {
    const parsed = suggestionSchema.safeParse(feature)
    return parsed.success ? [parsed.data.properties] : []
  })
}

export async function resolveAddress(id: string, request: Request): Promise<Place> {
  const features = await geocode({
    q: id,
    autocomplete: 'false',
    permanent: 'true',
    limit: '1',
  }, request, env.MAPBOX_RESOLVE_LIMIT)
  const { geometry, properties } = addressFeatureSchema.parse(features[0])
  if (properties.mapbox_id !== id) throw new Error('Mapbox returned a different address.')

  const { context } = properties
  const [lng, lat] = geometry.coordinates
  return {
    lat,
    lng,
    address: {
      street_number: context.address.address_number,
      route: context.address.street_name,
      neighborhood: context.neighborhood?.name ?? '',
      locality: context.place?.name ?? context.locality?.name ?? '',
      administrative_area_level_2: context.district?.name ?? '',
      administrative_area_level_1: context.region?.name ?? '',
      country: context.country?.name ?? '',
      postal_code: context.postcode?.name ?? '',
    },
  }
}
