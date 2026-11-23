import * as React from 'react'
import { useCombobox } from 'downshift'
import { z } from 'zod'
import type { AddressType } from '../utils/schemas'

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
type GeocoderInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onPlaceSelect: (place: Place) => void
}

const accessToken = import.meta.env.VITE_MAPBOX_KEY

async function geocode(params: Record<string, string>, signal: AbortSignal) {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.search = new URLSearchParams({ ...params, access_token: accessToken }).toString()

  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
  })
  if (!response.ok) throw new Error('Mapbox geocoding failed.')

  return collectionSchema.parse(await response.json()).features
}

async function resolveAddress(id: string, signal: AbortSignal): Promise<Place> {
  const features = await geocode({ q: id, autocomplete: 'false', permanent: 'true', limit: '1' }, signal)
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

export function GeocoderInput({ id, onPlaceSelect, onChange, ...inputProps }: GeocoderInputProps) {
  const [items, setItems] = React.useState<Suggestion[]>([])
  const [message, setMessage] = React.useState('')
  const resolution = React.useRef<AbortController>()
  const { getInputProps, getMenuProps, getItemProps, isOpen, highlightedIndex, inputValue, selectedItem } =
    useCombobox({
      inputId: id,
      items,
      itemToString: item => item?.full_address ?? '',
      stateReducer(state, { type, changes }) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputChange:
            return { ...changes, selectedItem: null, highlightedIndex: -1 }
          case useCombobox.stateChangeTypes.InputBlur:
          case useCombobox.stateChangeTypes.InputKeyDownEscape:
            return { ...changes, inputValue: state.inputValue, selectedItem: state.selectedItem }
          default:
            return changes
        }
      },
      async onSelectedItemChange({ selectedItem: item }) {
        if (!item) return
        resolution.current?.abort()
        const controller = new AbortController()
        resolution.current = controller
        setItems([])
        setMessage('Confirming address…')
        try {
          const place = await resolveAddress(item.mapbox_id, controller.signal)
          if (controller.signal.aborted) return
          onPlaceSelect(place)
          setMessage('')
        } catch {
          if (!controller.signal.aborted) setMessage('Could not confirm the address. Edit it and try again.')
        }
      },
    })

  React.useEffect(() => () => resolution.current?.abort(), [])

  React.useEffect(() => {
    const query = inputValue.trim()
    if (!accessToken || !isOpen || selectedItem || query.length < 3) return

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      try {
        const features = await geocode({
          q: query,
          autocomplete: 'true',
          proximity: '-78.8784,42.8864',
          types: 'address',
          limit: '5',
        }, controller.signal)
        if (controller.signal.aborted) return
        const suggestions = features.flatMap(feature => {
          const parsed = suggestionSchema.safeParse(feature)
          return parsed.success ? [parsed.data.properties] : []
        })
        setItems(suggestions)
        setMessage(suggestions.length ? '' : 'No matching addresses.')
      } catch {
        if (!controller.signal.aborted) setMessage('Address suggestions are temporarily unavailable.')
      }
    }, 350)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [inputValue, isOpen, selectedItem])

  return (
    <div className="position-relative">
      <input
        {...getInputProps({
          ...inputProps,
          'aria-labelledby': undefined,
          onChange: event => {
            resolution.current?.abort()
            setItems([])
            setMessage('')
            onChange?.(event as React.ChangeEvent<HTMLInputElement>)
          },
        })}
      />
      <ul {...getMenuProps()} className="list-group position-absolute w-100 z-3 shadow" hidden={!isOpen || !items.length}>
        {isOpen && items.map((item, index) => (
          <li
            key={item.mapbox_id}
            {...getItemProps({ item, index })}
            className={`list-group-item list-group-item-action${highlightedIndex === index ? ' active' : ''}`}
          >
            {item.full_address}
          </li>
        ))}
      </ul>
      {message && <div className="form-text" role="status">{message}</div>}
    </div>
  )
}
