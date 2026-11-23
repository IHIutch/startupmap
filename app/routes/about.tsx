import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { GeocoderInput } from '../../components/geocoder-input'
import { submitStartup } from '../../utils/air-table.server'
import { stageOptions, submissionSchema } from '../../utils/schemas'

const handleSubmit = createServerFn({ method: 'POST' })
  .validator((formData: FormData) => {
    try {
      const { address, lat, lng } = JSON.parse(String(formData.get('address') ?? ''))
      const result = submissionSchema.safeParse({
        ...Object.fromEntries(formData),
        address,
        lat,
        lng,
      })
      return result.success ? result.data : null
    } catch {
      return null
    }
  })
  .handler(async ({ data }) => {
    if (!data) return { error: 'Check the form and select an address from the suggestions.' }
    try {
      await submitStartup(data)
      return { error: null }
    } catch {
      return { error: 'We could not save your submission. Please try again.' }
    }
  })

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {

  const [addressString, setAddressString] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const submit = useServerFn(handleSubmit)
  const navigate = useNavigate()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    setSaving(true)
    try {
      const result = await submit({ data })
      if (result.error) setError(result.error)
      else await navigate({ to: '/thanks' })
    } catch {
      setError('We could not save your submission. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <Link to="/" className="navbar-brand">Buffalo Startup Map</Link>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link btn btn-secondary small">Cancel</Link>
          </li>
        </ul>
      </nav>
      <div className="row">
        <div className="col col-md-6 offset-md-3 mt-5 pt-5 pb-4">
          <h1 className="mt-5">Add a Startup</h1>
          <p>
            Enter the business information for review before it appears on the Buffalo Startup Map.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-6 offset-md-3">
          <form
            onSubmit={onSubmit}
            autoComplete="off"
          >
            <div className="mt-3">
              <label htmlFor="company" className="form-label">Company Name</label>
              <input
                className="form-control"
                id="company"
                name="company"
                required
                placeholder="Startup business name... "
              />
            </div>
            <div className="mt-3" >
              <label htmlFor="autocomplete" className="form-label">Company Address</label>

              <GeocoderInput
                onPlaceSelect={(val) => setAddressString(JSON.stringify(val))}
                onChange={() => setAddressString('')}
                id="autocomplete"
                className="form-control"
                autoComplete="off"
                type="search"
                placeholder="Startup headquarters..."
                required
              />
              <input
                autoComplete="off"
                name="address"
                hidden
                readOnly
                value={addressString}
              // :state="validation"
              />
              <div className="invalid-feedback"
              // :state="validation"
              >
                Please select an address from the dropdown
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="mt-3"
                  id="category"
                >
                  <label htmlFor="category" className="form-label">Category</label>

                  <input
                    id="category"
                    name="category"
                    className="form-control"
                    placeholder="Ex: Healthcare ..."
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mt-3">
                  <label htmlFor="stage" className="form-label">Stage</label>
                  <select
                    id="stage"
                    name="stage"
                    className="form-select"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>-- Select a Stage --</option>
                    {stageOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="website" className="form-label">Website</label>
              <input
                id="website"
                name="website"
                className="form-control"
                placeholder="Startup website... "
                required
              />
            </div>
            <div className="mt-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Briefly describe the startup..."
                rows={3}
                maxLength={200}
                required
              />
            </div>

            <div className="mt-3">
              <label htmlFor="email" className="form-label">Your Email</label>
              <input
                id="email"
                name="email"
                className="form-control"
                type="email"
                placeholder="Best email for verification..."
                required
              />
            </div>
            <div className="text-center mb-5">
              {error && <p role="alert" className="text-danger">{error}</p>}
              <button
                type="submit"
                className="mt-3 mb-5 btn btn-primary"
                disabled={saving}
              >
                <span>{saving ? 'Submitting…' : 'Submit'}</span>
              </button>
              <p className="lightgrey">
                By clicking Submit you agree that the information listed above
                is true to the best of your knowledge. You're also saying it's
                cool if we email you. We won't spam you so don't worry, be
                happy. Now, submit your Startup already.
              </p>
              <br />
              <a className="lightgrey" href="https://www.helmux.com/work" target="_blank">
                Built with &#x2665;
              </a>
              <br />
              <br />
              <br />
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScA9hirfSieN7Wii81gPZGP3_zvJAzg9K4Ye51MTT9M8-Ybmg/viewform?usp=sf_link"
                target="_blank"
              >
                Feedback?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
