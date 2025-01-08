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
  try {
    const unknown: unknown = JSON.parse(todoList);

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
  } catch {
    return null;
  }
};

export const TodoList = {
  encode,
  decode,
};
