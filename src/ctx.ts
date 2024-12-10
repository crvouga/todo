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
  const keyValueDb = KeyValueDb({ t: "hash-map", hashMap: new Map() });
  const todoListDb = TodoListDb({ t: "key-value-db", keyValueDb });
  return {
    keyValueDb,
    todoListDb,
  };
};
