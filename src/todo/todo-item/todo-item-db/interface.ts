import { Paginated } from "../../../core/pagination.ts";
import { Result } from "../../../core/result.ts";
import { TodoListId } from "../../todo-list/todo-list-id.ts";
import { TodoItemId } from "../todo-item-id.ts";
import { TodoItem } from "../todo-item.ts";

export type ITodoItemDb = {
  put: (todoItem: TodoItem) => Promise<Result<null, Error>>;
  list: (input: {
    listId: TodoListId;
  }) => Promise<Result<Paginated<TodoItem>, Error>>;
  zap: (id: TodoItemId | null) => Promise<Result<null, Error>>;
};
