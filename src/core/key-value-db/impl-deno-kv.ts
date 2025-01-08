import { Err, Ok } from "../result.ts";
import { IKeyValueDb } from "./interface.ts";

export type Config = {
  t: "deno-kv";
};

export const KeyValueDb = async (_config: Config): Promise<IKeyValueDb> => {
  const kv = await Deno.openKv();
  return {
    async set(key, value) {
      const set = await kv.set([key], value);
      if (set.ok) {
        return Ok(null);
      }
      return Err(new Error("Deno KV did not return an ok response"));
    },
    async get(key) {
      const got = await kv.get([key]);
      if (typeof got.value === "string") {
        return Ok(got.value);
      }
      return Err(new Error("Deno KV did not return a string value"));
    },
  };
};
