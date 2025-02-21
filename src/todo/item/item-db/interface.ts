import { Paginated } from "../../../core/pagination.ts";
import { Result } from "../../../core/result.ts";
import { TodoListId } from "../../list/list-id.ts";
import { ItemFilter } from "../item-filter.ts";
import { TodoItemId } from "../item-id.ts";
import { TodoItem } from "../item.ts";

export type ITodoItemDb = {
  put: (todoItem: TodoItem) => Promise<Result<null, Error>>;
  list: (input: {
    listId: TodoListId;
    itemFilter: ItemFilter;
  }) => Promise<Result<Paginated<TodoItem>, Error>>;
  get: (id: TodoItemId | null) => Promise<Result<TodoItem | null, Error>>;
  zap: (id: TodoItemId | null) => Promise<Result<null, Error>>;
};
