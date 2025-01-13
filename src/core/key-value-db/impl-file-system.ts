import { delay } from "jsr:@std/async/delay";
import { Err, Ok } from "../result.ts";
import { IKeyValueDb } from "./interface.ts";

export type Config = {
  t: "file-system";
  filePath: string;
};

export const KeyValueDb = (config: Config): IKeyValueDb => {
  const { filePath } = config;

  try {
    Deno.statSync(filePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.writeTextFileSync(filePath, JSON.stringify({}));
    } else {
      throw err;
    }
  }

  return {
    async set(key, value) {
      try {
        await delay(100);

        const content = await Deno.readTextFile(filePath);
        const data = JSON.parse(content);

        data[key] = value;

        await Deno.writeTextFile(filePath, JSON.stringify(data, null, 2));

        return Ok(null);
      } catch (err) {
        return Err(err);
      }
    },

    async get(key) {
      try {
        await delay(100);

        const content = await Deno.readTextFile(filePath);
        const data = JSON.parse(content);

        return Ok(data[key] ?? null);
      } catch (err) {
        return Err(err);
      }
    },

    async zap(key) {
      try {
        await delay(100);

        const content = await Deno.readTextFile(filePath);
        const data = JSON.parse(content);

        delete data[key];

        await Deno.writeTextFile(filePath, JSON.stringify(data, null, 2));

        return Ok(null);
      } catch (err) {
        return Err(err);
      }
    },
  };
};
