import type { Result } from "../../utils";
import type {
  Pagination,
  TodoItem,
  TodoItemFilter,
  TodoItemSort,
  TodoList,
  TodoListSort,
  TodoListStats,
} from "../todo-list-shared";

export type Repo = {
  list: {
    findOneById: (params: {
      id: string;
    }) => Promise<Result<string, TodoList | null>>;
    updateOne: (params: { updated: TodoList }) => Promise<Result<string, null>>;
    insertOne: (params: { list: TodoList }) => Promise<Result<string, null>>;
    deleteById: (params: { id: string }) => Promise<Result<string, null>>;
    findManyWithStats: (
      params: {
        sort: TodoListSort;
        userId: string;
      } & Pagination
    ) => Promise<
      Result<
        string,
        { totalCount: number; items: (TodoList & TodoListStats)[] }
      >
    >;
  };
  item: {
    insertOne: (params: { item: TodoItem }) => Promise<Result<string, null>>;
    deleteById: (params: { id: string }) => Promise<Result<string, null>>;
    findOneById: (params: {
      id: string;
    }) => Promise<Result<string, TodoItem | null>>;
    updateOne: (params: { updated: TodoItem }) => Promise<Result<string, null>>;
    findManyWhere: (params: {
      listId: string;
      sort: TodoItemSort;
      filter: TodoItemFilter;
    }) => Promise<Result<string, TodoItem[]>>;
  };
  deleteByUserId: (params: { userId: string }) => Promise<Result<string, null>>;
};
