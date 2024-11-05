import Airtable from "airtable";
import { StartupType } from "./schemas";

const base = new Airtable({
  apiKey: 'patM0GvoSe90Tiqxg.bf4d165ad267485e2debbfe4051ca613c106e04db7dc5fad488f45fa96657be0'
}).base('appBdAZ8jmgQvqFxz');

const table = base("tblplgOs6uzvz3Kaq");

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
