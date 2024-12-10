import { delay } from "jsr:@std/async/delay";
import { IKeyValueDb } from "../../../core/key-value-db/interface.ts";
import { Err } from "../../../core/result.ts";
import { ITodoListDb } from "./interface.ts";

export type Config = {
  t: "key-value-db";
  keyValueDb: IKeyValueDb;
};

export const TodoListDb = (_config: Config): ITodoListDb => {
  return {
    async list() {
      await delay(1000);
      return Err(new Error("Not implemented"));
    },
    async put() {
      await delay(1000);
      return Err(new Error("Not implemented"));
    },
  };
};
