import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { resolveAddress, searchAddresses } from '../utils/mapbox.server'

export const searchMapboxAddresses = createServerFn({ method: 'POST' })
  .validator(z.string().trim().min(3).max(256).refine(query => !query.includes(';')))
  .handler(({ data }) => searchAddresses(data, getRequest()))

export const resolveMapboxAddress = createServerFn({ method: 'POST' })
  .validator(z.string().max(256).regex(/^[A-Za-z0-9_-]+={0,2}$/))
  .handler(({ data }) => resolveAddress(data, getRequest()))
