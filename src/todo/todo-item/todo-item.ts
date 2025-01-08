import { TodoListId } from "../todo-list/todo-list-id.ts";

export type TodoItem = {
  listId: TodoListId;
  id: string;
  label: string;
};
