import { IKeyValueDb, KeyValueDb } from "./core/key-value-db/index.ts";
import { TodoItemDb } from "./todo/todo-item/todo-item-db/index.ts";
import { ITodoItemDb } from "./todo/todo-item/todo-item-db/interface.ts";
import {
  ITodoListDb,
  TodoListDb,
} from "./todo/todo-list/todo-list-db/index.ts";

export type ICtx = {
  keyValueDb: IKeyValueDb;
  todoListDb: ITodoListDb;
  todoItemDb: ITodoItemDb;
};

const isProd = Boolean(Deno.env.get("DENO_DEPLOYMENT_ID"));

if (isProd) {
  console.log("running in production");
} else {
  console.log("running in development");
}

export const Ctx = async (): Promise<ICtx> => {
  const keyValueDb = await getKeyValueDb();
  const todoListDb = await TodoListDb({ t: "key-value-db", keyValueDb });
  const todoItemDb = await TodoItemDb({ t: "key-value-db", keyValueDb });
  return {
    keyValueDb,
    todoListDb,
    todoItemDb,
  };
};

const getKeyValueDb = async (): Promise<IKeyValueDb> => {
  if (isProd) {
    console.log("using deno-kv key-value db");
    return KeyValueDb({ t: "deno-kv" });
  }

  if (await isAllowedToUseFileSystem()) {
    console.log("using file-system key-value db");
    return KeyValueDb({ t: "file-system", filePath: "./data.json" });
  }

  console.log("using in-memory key-value db");
  return KeyValueDb({ t: "hash-map", hashMap: new Map() });
};

const isAllowedToUseFileSystem = async () => {
  const write = await Deno.permissions.query({ name: "write" });
  const read = await Deno.permissions.query({ name: "read" });
  return write.state === "granted" && read.state === "granted";
};
