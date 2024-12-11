import { IKeyValueDb, KeyValueDb } from "./core/key-value-db/index.ts";
import {
  ITodoListDb,
  TodoListDb,
} from "./todo/todo-list/todo-list-db/index.ts";

export type ICtx = {
  keyValueDb: IKeyValueDb;
  todoListDb: ITodoListDb;
};

export const Ctx = (): ICtx => {
  let keyValueDb = KeyValueDb({ t: "hash-map", hashMap: new Map() });
  keyValueDb = KeyValueDb({ t: "file-system", filePath: "./data.json" });
  const todoListDb = TodoListDb({ t: "key-value-db", keyValueDb });
  return {
    keyValueDb,
    todoListDb,
  };
};
