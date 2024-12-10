import * as ImplHashMap from "./impl-hash-map.ts";
import { IKeyValueDb } from "./interface.ts";

export type Config = ImplHashMap.Config;

export const KeyValueDb = (config: Config): IKeyValueDb => {
  switch (config.t) {
    case "hash-map": {
      return ImplHashMap.KeyValueDb(config);
    }
  }
};
