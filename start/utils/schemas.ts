import { z } from "zod";

export const stageOptions = [
  "n/a",
  "Idea",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E",
]

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

export const startupSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  description: z.string(),
  category: z.string(),
  email: z.string().email(),
  website: z.string(),
  company: z.string(),
  stage: z.string(),
  address: z.string()
    .transform(data => JSON.parse(data))
    .pipe(addressSchema)
})

export const incomingDataSchema = startupSchema.extend({
  id: z.string(),
  created: z.string().datetime(),
})

export type AddressType = z.infer<typeof addressSchema>
export type StartupType = z.infer<typeof startupSchema>
