import { Paginated } from "../../../core/pagination.ts";
import { Result } from "../../../core/result.ts";
import { TodoListId } from "../todo-list-id.ts";
import { TodoList } from "../todo-list.ts";

export type ITodoListDb = {
  put: (todoList: TodoList) => Promise<Result<null, Error>>;
  list: () => Promise<Result<Paginated<TodoList>, Error>>;
  get: (id: TodoListId) => Promise<Result<TodoList | null, Error>>;
};
