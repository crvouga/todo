import { delay } from "jsr:@std/async/delay";
import { Ok } from "../result.ts";
import { IKeyValueDb } from "./interface.ts";

export type Config = {
  t: "hash-map";
  hashMap: Map<string, string>;
  delay?: number;
};

export const KeyValueDb = (config: Config): IKeyValueDb => {
  return {
    async set(key, value) {
      await delay(config.delay ?? 0);
      config.hashMap.set(key, value);
      return Ok(null);
    },
    async get(key) {
      await delay(config.delay ?? 0);
      return Ok(config.hashMap.get(key) ?? null);
    },
  };
};
