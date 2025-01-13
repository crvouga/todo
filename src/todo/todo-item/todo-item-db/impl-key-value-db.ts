import { KeyValueDb } from "../../../core/key-value-db/index.ts";
import { IKeyValueDb } from "../../../core/key-value-db/interface.ts";
import { isErr, Ok } from "../../../core/result.ts";
import { TodoItem } from "../todo-item.ts";
import { ITodoItemDb } from "./interface.ts";

export type Config = {
  t: "key-value-db";
  keyValueDb: IKeyValueDb;
};

export const TodoItemDb = async (config: Config): Promise<ITodoItemDb> => {
  const keyValueDb = await KeyValueDb({
    t: "with-namespace",
    instance: config.keyValueDb,
    namespace: ["todo-items"],
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
    async list(input) {
      const allIds = await getAllIds();

      const results = await Promise.all(
        allIds.map(async (id) => await keyValueDb.get(id))
      );

      const todoItems = results.flatMap((result) => {
        if (isErr(result)) {
          return [];
        }

        const decoded = TodoItem.decode(result.v ?? "");

        if (!decoded) {
          return [];
        }

        if (decoded.listId !== input.listId) {
          return [];
        }

        return [decoded];
      });

      return Ok({
        items: todoItems,
        total: todoItems.length,
        limit: todoItems.length,
        offset: 0,
      });
    },
    async put(todoItem) {
      const allIds = await getAllIds();
      const allIdsNew = new Set(allIds);
      allIdsNew.add(todoItem.id);
      await keyValueDb.set(ALL_IDS_KEY, JSON.stringify([...allIdsNew]));
      return keyValueDb.set(todoItem.id, TodoItem.encode(todoItem));
    },
    async zap(id) {
      if (!id) {
        return Ok(null);
      }

      const allIds = await getAllIds();

      const allIdsNew = new Set(allIds);

      allIdsNew.delete(id);

      await keyValueDb.set(ALL_IDS_KEY, JSON.stringify([...allIdsNew]));

      return keyValueDb.zap(id);
    },
  };
};
