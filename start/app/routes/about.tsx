import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { GeocoderInput } from '../../components/geocoder-input'
import { createStartup } from '../../utils/air-table'
import { startupSchema } from '../../utils/schemas'

const handleSubmit = createServerFn('POST', async (formData: FormData) => {
  const company = formData.get('company')
  const stage = formData.get('stage')
  const category = formData.get('category')
  const email = formData.get('email')
  const website = formData.get('website')
  const description = formData.get('description')
  const address = formData.get('address')

  const parsedData = startupSchema.parse({
    company: company?.toString(),
    stage: stage?.toString(),
    category: category?.toString(),
    email: email?.toString(),
    website: website?.toString(),
    description: description?.toString(),
    address: JSON.stringify(JSON.parse(address?.toString() || '').address),
    lat: Number(JSON.parse(address?.toString() || '').lat),
    lng: Number(JSON.parse(address?.toString() || '').lng)
  })

  await createStartup(parsedData)

  return new Response('ok', {
    status: 301,
    headers: {
      Location: '/thanks',
    },
  })
})

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {

  const [addressString, setAddressString] = React.useState('')

  return (
    <div className="container">
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <Link className="navbar-brand" to="/">Buffalo Startup Map</Link>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link className="nav-link btn btn-secondary small" to="/">Cancel</Link>
          </li>
        </ul>
      </nav>
      <div className="row">
        <div className="col col-md-6 offset-md-3 mt-5 pt-5 pb-4">
          <h1 className="mt-5">Add a Startup</h1>
          <p>
            Enter the business information to plot them on the Buffalo Startup
            Map!
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-6 offset-md-3">
          <form
            action={handleSubmit.url} method="POST" encType="multipart/form-data"

            // @submit.stop.prevent="sendFormData" 
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
              // autoFocus
              />
            </div>
            <div className="mt-3" >
              <label htmlFor="autocomplete" className="form-label">Company Address</label>

              <GeocoderInput
                onPlaceSelect={(val) => setAddressString(JSON.stringify(val))}
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
                    // v-model="form.category"
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
                    // v-model="form.stage"
                    // :options="stages"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>-- Select a Stage --</option>
                    <option value="n/a">n/a</option>
                    <option value="Idea">Idea</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C">Series C</option>
                    <option value="Series D">Series D</option>
                    <option value="Series E">Series E+</option>
                    {/* <template v-slot:first>
                      <div className="select"-option :value="null" disabled=""
                        >-- Select a Stage --</divn
                      >
                    </template> */}
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
              <button
                type="submit"
                className="mt-3 mb-5 btn btn-primary"
              // :disabled="loading"
              >
                {/* <span v-if="loading">
                  <div className="spinner" small></div>
                  Saving...
                </span> */}
                <span>Submit</span>
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
