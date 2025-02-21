import { TodoItemId } from "./item/item-id.ts";
import { ItemFilter } from "./list-view-single/item-filter.ts";
import { TodoListId } from "./list/list-id.ts";

export type Route =
  | {
      t: "list-view-all";
    }
  | {
      t: "list-view";
      listId: TodoListId | null;
      itemFilter: ItemFilter;
    }
  | {
      t: "list-edit";
      listId: TodoListId | null;
    }
  | {
      t: "list-delete";
      listId: TodoListId | null;
    }
  | {
      t: "list-create";
    }
  | {
      t: "item-add";
      listId: TodoListId | null;
    }
  | {
      t: "item-delete";
      itemId: TodoItemId | null;
      itemFilter: ItemFilter;
    }
  | {
      t: "item-mark-as-done";
      itemId: TodoItemId | null;
      itemFilter: ItemFilter;
    }
  | {
      t: "item-mark-as-pending";
      itemId: TodoItemId | null;
      itemFilter: ItemFilter;
    };

const fromUrl = (url: URL): Route | null => {
  switch (url.pathname) {
    case "/todo": {
      return { t: "list-view-all" };
    }
    case "/todo/list-create": {
      return { t: "list-create" };
    }
    case "/todo/list-view": {
      return {
        t: "list-view",
        listId: TodoListId.decode(url.searchParams.get("id")),
        itemFilter: ItemFilter.decode(url.searchParams.get("filter")),
      };
    }
    case "/todo/list-delete": {
      return {
        t: "list-delete",
        listId: TodoListId.decode(url.searchParams.get("id")),
      };
    }
    case "/todo/list-edit": {
      return {
        t: "list-edit",
        listId: TodoListId.decode(url.searchParams.get("id")),
      };
    }
    case "/todo/item-add": {
      return {
        t: "item-add",
        listId: TodoListId.decode(url.searchParams.get("id")),
      };
    }
    case "/todo/item-delete": {
      return {
        t: "item-delete",
        itemId: TodoItemId.decode(url.searchParams.get("itemId")),
        itemFilter: ItemFilter.decode(url.searchParams.get("filter")),
      };
    }
    case "/todo/item-mark-as-done": {
      return {
        t: "item-mark-as-done",
        itemId: TodoItemId.decode(url.searchParams.get("itemId")),
        itemFilter: ItemFilter.decode(url.searchParams.get("filter")),
      };
    }
    case "/todo/item-mark-as-pending": {
      return {
        t: "item-mark-as-pending",
        itemId: TodoItemId.decode(url.searchParams.get("itemId")),
        itemFilter: ItemFilter.decode(url.searchParams.get("filter")),
      };
    }
    default: {
      return null;
    }
  }
};

const toUrl = (base: URL, route: Route): URL => {
  switch (route.t) {
    case "list-view-all": {
      return new URL("/todo", base);
    }
    case "list-view": {
      const url = new URL("/todo/list-view", base);
      if (route.listId) {
        url.searchParams.set("id", route.listId);
      }
      if (route.itemFilter) {
        url.searchParams.set("filter", ItemFilter.encode(route.itemFilter));
      }
      return url;
    }
    case "list-delete": {
      const url = new URL("/todo/list-delete", base);
      if (route.listId) {
        url.searchParams.set("id", route.listId);
      }
      return url;
    }
    case "list-create": {
      return new URL(`/todo/list-create`, base);
    }
    case "list-edit": {
      const params = new URLSearchParams();
      params.set("id", route.listId || "");
      return new URL(`/todo/list-edit?${params}`, base);
    }
    case "item-add": {
      const url = new URL("/todo/item-add", base);
      if (route.listId) {
        url.searchParams.set("id", route.listId);
      }
      return url;
    }
    case "item-delete": {
      const url = new URL("/todo/item-delete", base);
      if (route.itemId) {
        url.searchParams.set("itemId", route.itemId);
      }
      if (route.itemFilter) {
        url.searchParams.set("filter", ItemFilter.encode(route.itemFilter));
      }
      return url;
    }
    case "item-mark-as-done": {
      const url = new URL("/todo/item-mark-as-done", base);
      if (route.itemId) {
        url.searchParams.set("itemId", route.itemId);
      }
      if (route.itemFilter) {
        url.searchParams.set("filter", ItemFilter.encode(route.itemFilter));
      }
      return url;
    }
    case "item-mark-as-pending": {
      const url = new URL("/todo/item-mark-as-pending", base);
      if (route.itemId) {
        url.searchParams.set("itemId", route.itemId);
      }
      if (route.itemFilter) {
        url.searchParams.set("filter", ItemFilter.encode(route.itemFilter));
      }
      return url;
    }
  }
};

export const Route = {
  fromUrl,
  toUrl,
};
