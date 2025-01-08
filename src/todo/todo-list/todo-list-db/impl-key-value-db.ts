import { KeyValueDb } from "../../../core/key-value-db/index.ts";
import { IKeyValueDb } from "../../../core/key-value-db/interface.ts";
import { isErr, Ok } from "../../../core/result.ts";
import { TodoList } from "../todo-list.ts";
import { ITodoListDb } from "./interface.ts";

export type Config = {
  t: "key-value-db";
  keyValueDb: IKeyValueDb;
};

export const TodoListDb = (config: Config): ITodoListDb => {
  const keyValueDb = KeyValueDb({
    t: "with-namespace",
    instance: config.keyValueDb,
    namespace: ["todo-lists"],
  });

  const ALL_IDS_KEY = "all-ids";

  const getAllIds = async () => {
    const gotAllIds = await keyValueDb.get(ALL_IDS_KEY);
    if (isErr(gotAllIds)) {
      return [];
    }
    return JSON.parse(gotAllIds.v ?? "[]") as string[];
  };

  return {
    async list() {
      const allIds = await getAllIds();

      const results = await Promise.all(
        allIds.map(async (id) => await keyValueDb.get(id))
      );

      const todoLists = results.flatMap((result) => {
        if (isErr(result)) {
          return [];
        }

        const decoded = TodoList.decode(result.v ?? "");

        if (!decoded) {
          return [];
        }

        return [decoded];
      });

      return Ok({
        items: todoLists,
        total: todoLists.length,
        limit: todoLists.length,
        offset: 0,
      });
    },
    async get(id) {
      const got = await keyValueDb.get(id);

      if (isErr(got)) {
        return got;
      }

      const decoded = TodoList.decode(got.v ?? "");

      if (!decoded) {
        return Ok(null);
      }

      return Ok(decoded);
    },
    async put(todoList) {
      const allIds = await getAllIds();
      const allIdsNew = new Set(allIds);
      allIdsNew.add(todoList.id);
      await keyValueDb.set(ALL_IDS_KEY, JSON.stringify([...allIdsNew]));
      return keyValueDb.set(todoList.id, TodoList.encode(todoList));
    },
  };
};
