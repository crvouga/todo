import { IKeyValueDb } from "./interface.ts";

export type Config = {
  t: "with-namespace";
  namespace: string[];
  instance: IKeyValueDb;
};

const SEPARATOR = "/";

export const KeyValueDb = (config: Config): IKeyValueDb => {
  return {
    set(key, value) {
      const namespacedKey = [...config.namespace, key].join(SEPARATOR);
      return config.instance.set(namespacedKey, value);
    },
    get(key) {
      const namespacedKey = [...config.namespace, key].join(SEPARATOR);
      return config.instance.get(namespacedKey);
    },
  };
};
