import * as ImplKeyValueDb from "./impl-key-value-db.ts";
import { ITodoItemDb } from "./interface.ts";

export type Config = ImplKeyValueDb.Config;

export const TodoItemDb = (config: Config): Promise<ITodoItemDb> => {
  switch (config.t) {
    case "key-value-db": {
      return ImplKeyValueDb.TodoItemDb(config);
    }
  }
};
