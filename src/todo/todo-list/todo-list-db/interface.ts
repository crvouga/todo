import { Paginated } from "../../../core/pagination.ts";
import { Result } from "../../../core/result.ts";
import { TodoListId } from "../todo-list-id.ts";
import { TodoList } from "../todo-list.ts";

export type ITodoListDb = {
  put: (todoList: TodoList) => Promise<Result<null, Error>>;
  list: () => Promise<Result<Paginated<TodoList>, Error>>;
  get: (id: TodoListId | null) => Promise<Result<TodoList | null, Error>>;
  zap: (id: TodoListId | null) => Promise<Result<null, Error>>;
};
