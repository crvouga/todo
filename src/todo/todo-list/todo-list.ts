import { TodoListId } from "./todo-list-id.ts";

export type TodoList = {
  id: TodoListId;
  name: string;
};

const encode = (todoList: TodoList): string => {
  return JSON.stringify(todoList);
};

const decode = (todoList: string): TodoList | null => {
  try {
    return JSON.parse(todoList);
  } catch {
    return null;
  }
};

export const TodoList = {
  encode,
  decode,
};
