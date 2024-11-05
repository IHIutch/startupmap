import { z } from "zod";

export const startupSchema = z.object({
  id: z.string(),
  lat: z.number(),
  lng: z.number(),
  description: z.string(),
  created: z.string().datetime(),
  category: z.string(),
  email: z.string().email(),
  website: z.string(),
  company: z.string(),
  stage: z.string(),
  address: z.string()
    .transform(data => JSON.parse(data))
    .pipe(
      z.object({
        street_number: z.string().optional(),
        route: z.string().optional(),
        neighborhood: z.string().optional(),
        locality: z.string().optional(),
        administrative_area_level_2: z.string().optional(),
        administrative_area_level_1: z.string().optional(),
        country: z.string().optional(),
        postal_code: z.string().optional(),
      })
    )
})
