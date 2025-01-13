import { Paginated } from "../../../core/pagination.ts";
import { Result } from "../../../core/result.ts";
import { TodoListId } from "../../list/list-id.ts";
import { TodoItemId } from "../item-id.ts";
import { TodoItem } from "../item.ts";

export type ITodoItemDb = {
  put: (todoItem: TodoItem) => Promise<Result<null, Error>>;
  list: (input: {
    listId: TodoListId;
  }) => Promise<Result<Paginated<TodoItem>, Error>>;
  zap: (id: TodoItemId | null) => Promise<Result<null, Error>>;
};
