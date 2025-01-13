import { TodoListId } from "./list/list-id.ts";

export type Route =
  | {
      t: "list-view-all";
    }
  | {
      t: "list-view";
      listId: TodoListId | null;
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
  }
};

export const Route = {
  fromUrl,
  toUrl,
};
