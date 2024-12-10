export type Route =
  | {
      t: "index";
    }
  | {
      t: "list-read";
      listId: string | null;
    }
  | {
      t: "list-edit";
      listId: string | null;
    }
  | {
      t: "list-create";
    };

const fromUrl = (url: URL): Route | null => {
  switch (url.pathname) {
    case "/todo": {
      return { t: "index" };
    }
    case "/todo/list-create": {
      return { t: "list-create" };
    }
    case "/todo/list-view": {
      return {
        t: "list-read",
        listId: url.searchParams.get("id") || null,
      };
    }
    case "/todo/list-edit": {
      return {
        t: "list-edit",
        listId: url.searchParams.get("id") || null,
      };
    }
    default: {
      return null;
    }
  }
};

const toUrl = (base: URL, route: Route): URL => {
  switch (route.t) {
    case "index": {
      return new URL("/todo", base);
    }
    case "list-read": {
      const params = new URLSearchParams();
      params.set("id", route.listId || "");
      return new URL(`/todo/list-view?${params}`, base);
    }
    case "list-create": {
      return new URL(`/todo/list-create`, base);
    }
    case "list-edit": {
      const params = new URLSearchParams();
      params.set("id", route.listId || "");
      return new URL(`/todo/list-edit?${params}`, base);
    }
  }
};

export const Route = {
  fromUrl,
  toUrl,
};
