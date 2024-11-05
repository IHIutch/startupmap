import { createEnv } from "@t3-oss/env-core";
import { z, ZodError } from "zod";

export const env = createEnv({
  server: {
    AIRTABLE_API_KEY: z.string().min(1),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_GOOGLE_AUTOCOMPLETE_KEY: z.string().min(1),
    PUBLIC_MAPBOX_KEY: z.string().min(1),
    PUBLIC_AIRTABLE_BASE_ID: z.string().min(1),
    PUBLIC_AIRTABLE_TABLE_ID: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnvStrict: {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    // These are not sensitive values, so they are defined here instead of .env
    PUBLIC_GOOGLE_AUTOCOMPLETE_KEY: 'AIzaSyC2tSkbaL8SIQsSQGlIsQZXn-wHBD3z-Rs',
    PUBLIC_MAPBOX_KEY: 'pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA',
    PUBLIC_AIRTABLE_BASE_ID: 'appBdAZ8jmgQvqFxz',
    PUBLIC_AIRTABLE_TABLE_ID: 'tblplgOs6uzvz3Kaq',
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
  isServer: typeof window === "undefined",
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
  },
});
