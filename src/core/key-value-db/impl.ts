import * as ImplFileSystem from "./impl-file-system.ts";
import * as ImplHashMap from "./impl-hash-map.ts";
import { IKeyValueDb } from "./interface.ts";
import * as WithNamespace from "./with-namespace.ts";

export type Config =
  | ImplHashMap.Config
  | WithNamespace.Config
  | ImplFileSystem.Config;

export const KeyValueDb = (config: Config): IKeyValueDb => {
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
  }
};
