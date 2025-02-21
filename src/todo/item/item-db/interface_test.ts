import { assertEquals } from "jsr:@std/assert/equals";
import { KeyValueDb } from "../../../core/key-value-db/impl.ts";
import { Ok } from "../../../core/result.ts";
import { TodoItem } from "../item.ts";
import { Config, TodoItemDb } from "./impl.ts";

const Fixture = async (config: Config) => {
  const todoItemDb = await TodoItemDb(config);
  return {
    todoItemDb,
  };
};

const Fixtures = async () => {
  const configs: Config[] = [];

  configs.push({
    t: "key-value-db",
    keyValueDb: await KeyValueDb({
      t: "hash-map",
      hashMap: new Map(),
    }),
  });

  const TEST_FS = false;

  if (TEST_FS) {
    const filePath = "/tmp/todo-item-db.json";
    try {
      Deno.removeSync(filePath);
    } catch (err) {
      console.error(err);
    }
    configs.push({
      t: "key-value-db",
      keyValueDb: await KeyValueDb({ t: "file-system", filePath }),
    });
  }

  return Promise.all(configs.map(Fixture));
};

Deno.test("put and get", async () => {
  for (const f of await Fixtures()) {
    const todoItem = TodoItem.random();
    const before = await f.todoItemDb.list({
      listId: todoItem.listId,
    });
    const put = await f.todoItemDb.put(todoItem);
    const after = await f.todoItemDb.list({
      listId: todoItem.listId,
    });

    assertEquals(before, Ok({ items: [], limit: 0, offset: 0, total: 0 }));
    assertEquals(put, Ok(null));
    assertEquals(
      after,
      Ok({ items: [todoItem], limit: 1, offset: 0, total: 1 })
    );
  }
});

Deno.test("get", async () => {
  for (const f of await Fixtures()) {
    const todoItem = TodoItem.random();
    const before = await f.todoItemDb.get(todoItem.id);
    const put = await f.todoItemDb.put(todoItem);
    const get = await f.todoItemDb.get(todoItem.id);
    assertEquals(before, Ok(null));
    assertEquals(put, Ok(null));
    assertEquals(get, Ok(todoItem));
  }
});
