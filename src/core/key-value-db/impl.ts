import * as ImplDenoKv from "./impl-deno-kv.ts";
import * as ImplFileSystem from "./impl-file-system.ts";
import * as ImplHashMap from "./impl-hash-map.ts";
import { IKeyValueDb } from "./interface.ts";
import * as WithNamespace from "./with-namespace.ts";
export type Config =
  | ImplHashMap.Config
  | WithNamespace.Config
  | ImplFileSystem.Config
  | ImplDenoKv.Config;

export const KeyValueDb = async (config: Config): Promise<IKeyValueDb> => {
  switch (config.t) {
    case "hash-map": {
      return ImplHashMap.KeyValueDb(config);
    }

    case "with-namespace": {
      return WithNamespace.KeyValueDb(config);
    }

    case "file-system": {
      return ImplFileSystem.KeyValueDb(config);
    }

    case "deno-kv": {
      return await ImplDenoKv.KeyValueDb(config);
    }
  }
};
