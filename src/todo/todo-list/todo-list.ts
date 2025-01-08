import { safeJsonParse } from "../../core/json.ts";
import { isErr } from "../../core/result.ts";
import { TodoListId } from "./todo-list-id.ts";

export type TodoList = {
  id: TodoListId;
  name: string;
};

const encode = (todoList: TodoList): string => {
  try {
    return JSON.stringify(todoList);
  } catch (_e) {
    return "";
  }
};

const decode = (todoList: string): TodoList | null => {
  const parsed = safeJsonParse(todoList);

  if (isErr(parsed)) {
    return null;
  }

  const unknown = parsed.v;

  if (
    typeof unknown === "object" &&
    unknown !== null &&
    "id" in unknown &&
    TodoListId.is(unknown.id) &&
    "name" in unknown &&
    typeof unknown.name === "string"
  ) {
    const todoList: TodoList = {
      id: unknown.id,
      name: unknown.name,
    };
    return todoList;
  }

  return null;
};

export const TodoList = {
  encode,
  decode,
};
