import { safeJsonParse } from "../../core/json.ts";
import { isErr } from "../../core/result.ts";
import { TodoListId } from "../todo-list/todo-list-id.ts";
import { TodoItemId } from "./todo-item-id.ts";

export type TodoItem = {
  listId: TodoListId;
  id: TodoItemId;
  label: string;
};

const encode = (todoItem: TodoItem): string => {
  try {
    return JSON.stringify(todoItem);
  } catch (_e) {
    return "";
  }
};

const decode = (todoItem: string): TodoItem | null => {
  const parsed = safeJsonParse(todoItem);

  if (isErr(parsed)) {
    return null;
  }

  const unknown = parsed.v;

  if (
    typeof unknown === "object" &&
    unknown !== null &&
    "id" in unknown &&
    TodoItemId.is(unknown.id) &&
    "label" in unknown &&
    typeof unknown.label === "string" &&
    "listId" in unknown &&
    TodoListId.is(unknown.listId)
  ) {
    const todoItem: TodoItem = {
      id: unknown.id,
      label: unknown.label,
      listId: unknown.listId,
    };
    return todoItem;
  }

  return null;
};

const random = (overrides?: {
  id?: TodoItemId;
  label?: string;
  listId?: TodoListId;
}): TodoItem => {
  return {
    id: overrides?.id ?? TodoItemId.generate(),
    label: overrides?.label ?? Math.random().toString(36).slice(2),
    listId: overrides?.listId ?? TodoListId.generate(),
  };
};

export const TodoItem = {
  encode,
  decode,
  random,
};
