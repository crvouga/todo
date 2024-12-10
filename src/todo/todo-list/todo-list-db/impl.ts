import * as ImplKeyValueDb from "./impl-key-value-db.ts";
import { ITodoListDb } from "./interface.ts";

export type Config = ImplKeyValueDb.Config;

export const TodoListDb = (config: Config): ITodoListDb => {
  switch (config.t) {
    case "key-value-db": {
      return ImplKeyValueDb.TodoListDb(config);
    }
  }
};
