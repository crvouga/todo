import { assertEquals } from "jsr:@std/assert/equals";
import { KeyValueDb } from "../../../core/key-value-db/impl.ts";
import { TodoListId } from "../todo-list-id.ts";
import { TodoList } from "../todo-list.ts";
import { Config, TodoListDb } from "./impl.ts";
import { Ok } from "../../../core/result.ts";

const Fixture = (config: Config) => {
  const todoListDb = TodoListDb(config);
  return {
    todoListDb,
  };
};

const Fixtures = () => {
  const keyValueDb = KeyValueDb({ t: "hash-map", hashMap: new Map() });
  const configs: Config[] = [];

  configs.push({
    t: "key-value-db",
    keyValueDb,
  });

  return configs.map(Fixture);
};

Deno.test("put and get", async () => {
  for (const f of Fixtures()) {
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
  for (const f of Fixtures()) {
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
