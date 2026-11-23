import * as React from 'react'
import { useCombobox } from 'downshift'
import { useServerFn } from '@tanstack/react-start'
import { resolveMapboxAddress, searchMapboxAddresses } from '../app/mapbox'

type Suggestion = Awaited<ReturnType<typeof searchMapboxAddresses>>[number]
type Place = Awaited<ReturnType<typeof resolveMapboxAddress>>
type GeocoderInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onPlaceSelect: (place: Place) => void
}

export function GeocoderInput({ id, onPlaceSelect, onChange, ...inputProps }: GeocoderInputProps) {
  const [items, setItems] = React.useState<Suggestion[]>([])
  const [message, setMessage] = React.useState('')
  const resolution = React.useRef<AbortController>()
  const search = useServerFn(searchMapboxAddresses)
  const resolve = useServerFn(resolveMapboxAddress)
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
          const place = await resolve({
            data: item.mapbox_id,
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
          })
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
    if (!isOpen || selectedItem || query.length < 3) return

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      try {
        const suggestions = await search({
          data: query,
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
        })
        if (controller.signal.aborted) return
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
  }, [inputValue, isOpen, search, selectedItem])

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
