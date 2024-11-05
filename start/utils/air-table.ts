import Airtable from "airtable";
import { z } from "zod";
import { startupSchema } from "./schemas";

Airtable.configure({
  apiKey:
    "patM0GvoSe90Tiqxg.bf4d165ad267485e2debbfe4051ca613c106e04db7dc5fad488f45fa96657be0",
});

const base = Airtable.base("appBdAZ8jmgQvqFxz");
const table = base("tblplgOs6uzvz3Kaq");

export const getAllStartups = async () => {
  const records = await table.select().all();
  const data = records.map((d, idx) => ({
    id: String(idx),
    ...d.fields,
  }))

  // Throws error if invalid
  const parsedData = z.array(startupSchema).parse(data)

  return parsedData
}
