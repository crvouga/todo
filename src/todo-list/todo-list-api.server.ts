import type { Application } from "express";
import { v4 } from "uuid";
import {
  applyPatch,
  applyPatchTodoList,
  endpoints,
  filterer,
  sorter,
  TodoItem,
  TodoItemDeleteParams,
  TodoItemGetParams,
  TodoItemGot,
  TodoItemPatch,
  TodoItemPatchParams,
  TodoList,
  TodoListDeleteParams,
  TodoListGetOneParams,
  TodoListGot,
  TodoListPatchBody,
  TodoListPatchParams,
} from "./todo-list-shared";

//
// Data
//

// todo use a database

const todoItemMap = new Map<string, TodoItem>();
const todoListMap = new Map<string, TodoList>();

//
// initialize data
//

const titles = ["List A", "List B", "List C", "List D", "List E"];
const texts = [
  "Learn Vue.js",
  "Learn Vue.js composition API",
  "Go to the gym",
  "Hook up dynamodb",
  "Go to the store",
  "Add user auth",
];

titles.forEach((title) => {
  const list: TodoList = {
    createdAt: new Date(),
    id: v4(),
    title,
  };

  todoListMap.set(list.id, list);

  texts.forEach((text, i) => {
    const offset = i * 1000 * 60;
    const item: TodoItem = {
      listId: list.id,
      createdAt: new Date(Date.now() - offset),
      id: v4(),
      isCompleted: false,
      text: text,
    };
    todoItemMap.set(item.id, item);
  });
});

const StatusCode = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
};

const duration = 500;

const timeout = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const useTodoListApi = (app: Application) => {
  //
  //
  // Todo Items
  //
  //

  app.post(endpoints["/todo-item"], async (req, res) => {
    const result = TodoItem.safeParse(req.body);

    if (!result.success) {
      res.status(StatusCode.BadRequest).json(result.error).end();
      return;
    }

    const todoItemNew = result.data;

    todoItemMap.set(todoItemNew.id, todoItemNew);

    await timeout(duration);

    res.status(StatusCode.Created).end();
  });

  app.delete(endpoints["/todo-item"], async (req, res) => {
    const result = TodoItemDeleteParams.safeParse(req.query);

    if (!result.success) {
      res.status(StatusCode.BadRequest).json(result.error).end();
      return;
    }

    const itemId = result.data.itemId;

    todoItemMap.delete(itemId);

    await timeout(duration);

    res.status(StatusCode.Created).end();
  });

  app.patch(endpoints["/todo-item"], async (req, res) => {
    const params = TodoItemPatchParams.safeParse(req.query);
    if (!params.success) {
      res.status(StatusCode.BadRequest).json(params.error).end();
      return;
    }

    const patch = TodoItemPatch.safeParse(req.body);

    if (!patch.success) {
      res.status(StatusCode.BadRequest).json(patch.error).end();
      return;
    }

    const item = todoItemMap.get(params.data.itemId);

    if (!item) {
      res.status(StatusCode.NotFound).end();
      return;
    }

    const patched = applyPatch(item, patch.data);

    todoItemMap.set(patched.id, patched);

    await timeout(1000 / 3);

    res.status(204).end();
  });

  app.get(endpoints["/todo-item"], async (req, res) => {
    const parsed = TodoItemGetParams.safeParse(req.query);

    if (!parsed.success) {
      res.status(StatusCode.BadRequest).json(parsed.error).end();
      return;
    }

    const params = parsed.data;

    const items = Array.from(todoItemMap.values())
      .filter(filterer({ filter: params.filter }))
      .filter((item) => item.listId === parsed.data.listId)
      .sort(sorter({ sort: params.sort }));

    const json: TodoItemGot = {
      items,
    };

    await timeout(duration);

    res.json(json);
  });

  //
  //
  //
  // Todo List
  //
  //
  //

  app.get(endpoints["/todo-list-one"], async (req, res) => {
    const params = TodoListGetOneParams.safeParse(req.query);

    if (!params.success) {
      res.status(StatusCode.BadRequest).json(params.error).end();
      return;
    }
    const lists = Array.from(todoListMap.values()).filter(
      (list) => list.id === params.data.listId
    );

    const list = lists[0];

    if (!list) {
      res.status(StatusCode.NotFound).end();
      return;
    }

    await timeout(duration);

    res.json(list);
  });

  app.get(endpoints["/todo-list"], async (req, res) => {
    const lists = Array.from(todoListMap.values());
    const json: TodoListGot = {
      items: lists.map((list) => {
        const items = Array.from(todoItemMap.values()).filter(
          (item) => item.listId === list.id
        );
        const activeCount = items.filter((item) => !item.isCompleted).length;
        const completedCount = items.filter((item) => item.isCompleted).length;
        return {
          ...list,
          activeCount,
          completedCount,
        };
      }),
    };
    await timeout(duration);
    res.json(json);
  });

  app.delete(endpoints["/todo-list"], async (req, res) => {
    const parsed = TodoListDeleteParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(StatusCode.BadRequest).json(parsed.error).end();
      return;
    }
    todoListMap.delete(parsed.data.listId);
    await timeout(duration);
    res.status(StatusCode.Ok).end();
  });

  app.post(endpoints["/todo-list"], async (req, res) => {
    const parsed = TodoList.safeParse(req.body);
    if (!parsed.success) {
      res.status(StatusCode.BadRequest).json(parsed.error).end();
      return;
    }
    todoListMap.set(parsed.data.id, parsed.data);
    await timeout(duration);
    res.status(StatusCode.Created).end();
  });

  app.patch(endpoints["/todo-list"], async (req, res) => {
    const parsedParams = TodoListPatchParams.safeParse(req.query);
    if (!parsedParams.success) {
      res.status(StatusCode.BadRequest).json(parsedParams.error).end();
      return;
    }
    const parsedBody = TodoListPatchBody.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(StatusCode.BadRequest).json(parsedBody.error).end();
      return;
    }
    const existing = todoListMap.get(parsedParams.data.itemId);
    if (!existing) {
      res.status(StatusCode.NotFound).end();
      return;
    }
    const patched = applyPatchTodoList(existing, parsedBody.data);
    todoListMap.set(patched.id, patched);
    await timeout(duration);
    res.status(StatusCode.Ok).end();
  });
};