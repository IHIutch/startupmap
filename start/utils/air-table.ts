import Airtable from "airtable";
import { StartupType } from "./schemas";
import { env } from "../env";

const base = new Airtable({
  apiKey: env.AIRTABLE_API_KEY,
}).base(env.PUBLIC_AIRTABLE_BASE_ID);

const table = base(env.PUBLIC_AIRTABLE_TABLE_ID);

export const getAllStartups = async () => {
  const records = await table.select().all();
  return records.map((d) => ({
    id: d.id,
    ...d.fields,
  }))
}

export const createStartup = async (payload: StartupType) => {
  return await table.create({
    ...payload,
    address: JSON.stringify(payload.address)
  }, {
    typecast: true
  })
}
