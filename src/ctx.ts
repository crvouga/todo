import { IKeyValueDb, KeyValueDb } from "./core/key-value-db/index.ts";
import {
  ITodoListDb,
  TodoListDb,
} from "./todo/todo-list/todo-list-db/index.ts";

export type ICtx = {
  keyValueDb: IKeyValueDb;
  todoListDb: ITodoListDb;
};

export const Ctx = async (): Promise<ICtx> => {
  const keyValueDb = await getKeyValueDb();
  const todoListDb = await TodoListDb({ t: "key-value-db", keyValueDb });
  return {
    keyValueDb,
    todoListDb,
  };
};

const getKeyValueDb = async (): Promise<IKeyValueDb> => {
  const writePermission = await Deno.permissions.query({ name: "write" });
  const readPermission = await Deno.permissions.query({ name: "read" });
  if (
    writePermission.state === "granted" &&
    readPermission.state === "granted"
  ) {
    console.log("using file-system key-value db");
    return KeyValueDb({ t: "file-system", filePath: "./data.json" });
  }
  if (Deno.env.get("DENO_ENV") === "production") {
    console.log("using deno-kv key-value db");
    return KeyValueDb({ t: "deno-kv" });
  }
  console.log("using in-memory key-value db");
  return KeyValueDb({ t: "hash-map", hashMap: new Map() });
};
