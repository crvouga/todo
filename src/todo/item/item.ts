import { safeJsonParse } from "../../core/json.ts";
import { isErr } from "../../core/result.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoItemId } from "./item-id.ts";
import { ItemStatus } from "./item-status.ts";

export type TodoItem = {
  listId: TodoListId;
  id: TodoItemId;
  label: string;
  status: ItemStatus;
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
      status:
        "status" in unknown
          ? ItemStatus.decode(unknown.status) ?? "pending"
          : "pending",
    };
    return todoItem;
  }

  return null;
};

const random = (overrides?: {
  id?: TodoItemId;
  label?: string;
  listId?: TodoListId;
  status?: ItemStatus;
}): TodoItem => {
  return {
    id: overrides?.id ?? TodoItemId.generate(),
    label: overrides?.label ?? Math.random().toString(36).slice(2),
    listId: overrides?.listId ?? TodoListId.generate(),
    status: overrides?.status ?? "pending",
  };
};

const markAsDone = (item: TodoItem): TodoItem => {
  return {
    ...item,
    status: "done",
  };
};

const markAsPending = (item: TodoItem): TodoItem => {
  return {
    ...item,
    status: "pending",
  };
};

export const TodoItem = {
  encode,
  decode,
  random,
  markAsDone,
  markAsPending,
};
