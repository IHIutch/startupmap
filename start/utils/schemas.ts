import { z } from 'zod'

export const stageOptions = [
  'n/a',
  'Idea',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D',
  'Series E',
] as const

const addressSchema = z.object({
  street_number: z.string().optional(),
  route: z.string().optional(),
  neighborhood: z.string().optional(),
  locality: z.string().optional(),
  administrative_area_level_2: z.string().optional(),
  administrative_area_level_1: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
})

export const publicListingSchema = z.object({
  id: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  description: z.string(),
  category: z.string(),
  website: z.string(),
  company: z.string(),
  stage: z.string(),
})

export const submissionSchema = publicListingSchema.omit({ id: true }).extend({
  description: z.string().trim().min(1).max(3000),
  category: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  website: z.string().trim().min(1).max(300),
  company: z.string().trim().min(1).max(150),
  stage: z.enum(stageOptions),
  address: addressSchema.refine(address => Boolean(address.route || address.locality)),
})

export type AddressType = z.infer<typeof addressSchema>
export type PublicListing = z.infer<typeof publicListingSchema>
export type StartupSubmission = z.infer<typeof submissionSchema>
