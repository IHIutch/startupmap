import * as React from 'react'
import { createFileRoute, Link, stripSearchParams, useNavigate } from '@tanstack/react-router'
import { getAllStartups } from '../../utils/air-table'
import { Map, Marker } from 'pigeon-maps'
import { z } from 'zod'
import { incomingDataSchema } from '../../utils/schemas'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA'

const searchSchema = z.object({
  search: z.string().optional(),
  company: z.string().optional(),
  types: z.string().array().optional(),
  stages: z.string().array().optional(),
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const allStartups = await getAllStartups()
    // Throws error if invalid
    const parsedData = z.array(incomingDataSchema).parse(allStartups)
    return {
      allStartups: parsedData
    }
  },
  search: {
    middlewares: [
      stripSearchParams({
        types: [],
        stages: [],
        search: '',
        company: ''
      }),
    ],
  },
  validateSearch: searchSchema
})

function Home() {
  const searchParams = Route.useSearch()
  const { allStartups } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

  const [isStagesMenuOpen, setIsStagesMenuOpen] = React.useState(false)
  const [isTypesMenuOpen, setIsTypesMenuOpen] = React.useState(false)

  const uniqueTypes = [...new Set(allStartups.map((as) => as.category))].sort();
  const uniqueStages = [...new Set(allStartups.map((as) => as.stage))];

  const activeCompany = allStartups.find(s => s.company === searchParams.company)

  const filteredStartups = (searchParams.stages || searchParams.types) ? allStartups.filter(as => {
    return searchParams.stages?.includes(as.stage) || searchParams.types?.includes(as.category)
  }) : allStartups

  const sidebarStartups = (activeCompany || searchParams.search) ? allStartups.filter(as => {
    const lowerCaseSearch = searchParams.search?.toLowerCase()
    const matchesLocation = activeCompany === undefined || (
      as.lat === activeCompany.lat && as.lng === activeCompany.lng
    )
    const matchesSearch = lowerCaseSearch === undefined || (
      as.company
        .toLowerCase()
        .includes(lowerCaseSearch) ||
      as.description
        .toLowerCase()
        .includes(lowerCaseSearch) ||
      as.category
        .toLowerCase()
        .includes(lowerCaseSearch) ||
      as.stage
        .toLowerCase()
        .includes(lowerCaseSearch)
    )
    return matchesLocation && matchesSearch
  }) : allStartups

  return (
    <div className="container-fluid vh-100">
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <a href="/" className="navbar-brand">Buffalo Startup Map</a>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <a href="/about" className="nav-link btn btn-primary small">Add Startup</a>
          </li>
        </ul>
      </nav>

      <div className="row h-100">
        <div className="col-12 h-100 px-0">
          <div className="filter-buttons">
            <button
              className={`btn btn-sm ${isTypesMenuOpen ? 'selected' : null}`}
              type="button"
              onClick={() => {
                setIsStagesMenuOpen(false)
                setIsTypesMenuOpen(!isTypesMenuOpen)
              }}
            >
              Types ({searchParams.types?.length || 0})
            </button>
            <button
              className={`btn btn-sm ${isStagesMenuOpen ? 'selected' : null}`}
              type="button"
              onClick={() => {
                setIsTypesMenuOpen(false)
                setIsStagesMenuOpen(!isStagesMenuOpen)
              }}
            >
              Stages ({searchParams.stages?.length || 0})
            </button>

            <div className="input-group mb-3">
              <input
                type="search"
                placeholder="Filter & Search Buffalo Startups..."
                className="form-control rounded-pill"
                onChange={(e) => navigate({
                  replace: true,
                  to: Route.fullPath,
                  search: (prev) => ({
                    ...prev,
                    search: e.target.value
                  })
                })}
              />
            </div>
          </div>

          <div className="filters mb-3">
            {isTypesMenuOpen
              ? (
                <div className="filter-options">
                  <div className="row">
                    <div className="col-12 position-relative">
                      <h3>Types</h3>
                      <button
                        className="btn btn-link"
                        onClick={() => navigate({
                          replace: true,
                          to: Route.fullPath,
                          search: (prev) => ({
                            ...prev,
                            types: []
                          })
                        })}
                      >
                        [ Clear All Types ]
                      </button>
                    </div>
                    {uniqueTypes.map(ut => (
                      <div key={ut} className="col-4">
                        <div className="form-check">
                          <input
                            id={ut}
                            className="form-check-input"
                            type="checkbox"
                            checked={!!searchParams.types?.includes(ut)}
                            onChange={() => navigate({
                              replace: true,
                              to: Route.fullPath,
                              search: (prev) => ({
                                ...prev,
                                types: prev.types?.includes(ut)
                                  ? prev.types.filter(s => s !== ut)
                                  : (prev.types || []).concat([ut])
                              })
                            })}
                          />
                          <label
                            htmlFor={ut}
                            className="form-check-label"
                          >
                            {ut}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
              : null}
            {isStagesMenuOpen
              ? (
                <div className="filter-options">
                  <div className="row">
                    <div className="col-12 position-relative">
                      <h3>Stages</h3>
                      <button
                        className="btn btn-link"
                        onClick={() => navigate({
                          replace: true,
                          to: Route.fullPath,
                          search: (prev) => ({
                            ...prev,
                            stages: []
                          })
                        })}
                      >
                        [ Clear All Stages ]
                      </button>
                    </div>
                    {uniqueStages.map(us => (
                      <div key={us} className="col-6">
                        <div className="form-check">
                          <input
                            id={us}
                            className="form-check-input"
                            type="checkbox"
                            checked={!!searchParams.stages?.includes(us)}
                            onChange={() => navigate({
                              replace: true,
                              to: Route.fullPath,
                              search: (prev) => ({
                                ...prev,
                                stages: prev.stages?.includes(us)
                                  ? prev.stages.filter(s => s !== us)
                                  : (prev.stages || []).concat([us])
                              })
                            })}
                          />
                          <label
                            htmlFor={us}
                            className="form-check-label"
                          >
                            {us}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
              : null}
          </div>

          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <Map
              provider={(x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${z}/${x}/${y}@2x?access_token=${MAPBOX_TOKEN}`}
              defaultCenter={[42.8964, -78.846804]}
              defaultZoom={12}
            >
              {filteredStartups.map((d) => (
                <Marker
                  key={d.id}
                  anchor={[d.lat, d.lng]}
                  style={{
                    pointerEvents: 'auto',
                    filter: 'none'
                  }}
                >
                  <button
                    onClick={() => navigate({
                      replace: true,
                      to: Route.fullPath,
                      search: (prev) => ({
                        ...prev,
                        company: d.company
                      })
                    })}
                    style={{
                      display: "block",
                      backgroundColor: searchParams.company === d.company ? '#EE00FF' : '#0000EE',
                      height: '22px',
                      width: '22px',
                      borderRadius: '99rem',
                      border: 0,
                      opacity: 0.6
                    }}
                  >
                    <span className="visually-hidden">{d.company}</span>
                  </button>
                </Marker>
              ))}
            </Map>
          </div>
        </div>

        <div className="col-xs-12 col-md-4 listings">
          <ul className="list-group list-group-flush">
            {sidebarStartups.map(ss => (
              <li
                key={ss.id}
                className="list-group-item"
              >
                <div>
                  <h2 className="h4 mb-1">
                    {ss.company}
                  </h2>
                  <h3 className="h6 mt-1 mb-2">
                    <div>
                      {ss.description}
                    </div>
                  </h3>
                  <ul>
                    <li>
                      <span className="label">Type:</span>
                      {ss.category}
                    </li>
                    <li>
                      <span className="label">Stage:</span>
                      {ss.stage}
                    </li>
                    <li>
                      <a
                        className="btn btn-sm btn-primary fixed-bottom-right"
                        href={new RegExp("^https?://").test(ss.website) ? ss.website : "https://" + ss.website}
                        target="_blank">View</a>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-sm white full-width"
            onClick={() => navigate({
              replace: true,
              search: (prev) => ({
                ...prev,
                company: ''
              })
            })}
          >
            Show All
          </button>
        </div>
      </div>

      <a className="linkfixed" href="https://www.helmux.com/" target="_blank"
      >Built with &#x2665;</a>
    </div >
  )
}
