import * as React from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AddressType } from '../utils/schemas';

type Place = {
  address: AddressType,
  lat: number | undefined,
  lng: number | undefined
}

type GeocoderInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onPlaceSelect: (place: Place) => void;
}

export const GeocoderInput = ({ onPlaceSelect, ...inputProps }: GeocoderInputProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    React.useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  React.useEffect(() => {
    if (!places || !inputRef.current) return;

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      fields: ["address_component", "geometry"]
    }));
  }, [places]);

  React.useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace()
      const address = {
        street_number: '',
        route: '',
        neighborhood: '',
        locality: '',
        administrative_area_level_2: '',
        administrative_area_level_1: '',
        country: '',
        postal_code: '',
      }
      if (place.address_components?.length) {
        // Formats Googles getPlace() result into something more manageable
        place.address_components.forEach((component) => {
          const type = component.types[0];
          if (type in address) {
            address[type] = component.long_name;
          }
        });

      }
      onPlaceSelect({
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        address
      });
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <Provider>
      <input
        {...inputProps}
        ref={inputRef}
      />
    </Provider>
  );
};


const GOOGLE_API_KEY = "AIzaSyC2tSkbaL8SIQsSQGlIsQZXn-wHBD3z-Rs"

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <APIProvider apiKey={GOOGLE_API_KEY}>
      {children}
    </APIProvider>
  )
}
