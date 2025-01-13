import { assertEquals } from "jsr:@std/assert/equals";
import { KeyValueDb } from "../../../core/key-value-db/impl.ts";
import { TodoListId } from "../list-id.ts";
import { TodoList } from "../list.ts";
import { Config, TodoListDb } from "./impl.ts";
import { Ok } from "../../../core/result.ts";

const Fixture = async (config: Config) => {
  const todoListDb = await TodoListDb(config);
  return {
    todoListDb,
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
    const filePath = "/tmp/todo-list-db.json";
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
    const todoList: TodoList = {
      id: TodoListId.generate(),
      name: "todo-list",
    };

    const before = await f.todoListDb.get(todoList.id);
    const put = await f.todoListDb.put(todoList);
    const after = await f.todoListDb.get(todoList.id);

    assertEquals(before, Ok(null));
    assertEquals(put, Ok(null));
    assertEquals(after, Ok(todoList));
  }
});

Deno.test("list", async () => {
  for (const f of await Fixtures()) {
    const expected: TodoList[] = [
      {
        id: TodoListId.generate(),
        name: "todo-list",
      },
      {
        id: TodoListId.generate(),
        name: "todo-list",
      },
      {
        id: TodoListId.generate(),
        name: "todo-list",
      },
    ];

    const before = await f.todoListDb.list();
    for (const todoList of expected) {
      const put = await f.todoListDb.put(todoList);
      assertEquals(put, Ok(null));
    }
    const after = await f.todoListDb.list();

    assertEquals(
      before,
      Ok({
        items: [],
        total: 0,
        limit: 0,
        offset: 0,
      })
    );
    assertEquals(
      after,
      Ok({
        items: expected,
        total: expected.length,
        limit: expected.length,
        offset: 0,
      })
    );
  }
});

Deno.test("zap", async () => {
  for (const f of await Fixtures()) {
    const todoList: TodoList = {
      id: TodoListId.generate(),
      name: "todo-list",
    };
    await f.todoListDb.put(todoList);

    const before = await f.todoListDb.get(todoList.id);
    const zapped = await f.todoListDb.zap(todoList.id);
    const after = await f.todoListDb.get(todoList.id);

    assertEquals(before, Ok(todoList));
    assertEquals(zapped, Ok(null));
    assertEquals(after, Ok(null));
  }
});

Deno.test("zap and list", async () => {
  for (const f of await Fixtures()) {
    const todoList: TodoList = {
      id: TodoListId.generate(),
      name: "todo-list",
    };
    await f.todoListDb.put(todoList);

    const before = await f.todoListDb.list();
    const zapped = await f.todoListDb.zap(todoList.id);
    const after = await f.todoListDb.list();

    assertEquals(
      before,
      Ok({
        items: [todoList],
        total: 1,
        limit: 1,
        offset: 0,
      })
    );
    assertEquals(zapped, Ok(null));
    assertEquals(
      after,
      Ok({
        items: [],
        total: 0,
        limit: 0,
        offset: 0,
      })
    );
  }
});
