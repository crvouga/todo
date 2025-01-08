import * as Todo from "./todo/index.ts";

export type Route =
  | {
      t: "index";
    }
  | {
      t: "todo";
      c: Todo.Route;
    };

const fromUrl_ = (url: URL): Route | null => {
  switch (url.pathname) {
    case "/": {
      return { t: "index" };
    }
    default: {
      return null;
    }
  }
};

const fromUrl = (url: URL): Route | null => {
  const index = fromUrl_(url);
  if (index) {
    return index;
  }
  const todo = Todo.Route.fromUrl(url);
  if (todo) {
    return { t: "todo", c: todo };
  }
  return null;
};

const toUrl = (base: URL, route: Route): URL => {
  switch (route.t) {
    case "index": {
      return new URL("/", base);
    }
    case "todo": {
      return Todo.Route.toUrl(base, route.c);
    }
  }
};

const toHref = (route: Route): string => {
  const dummyBase = new URL("http://localhost");
  return toUrl(dummyBase, route).pathname;
};

export const href = (route: Route): string => {
  const dummyBase = new URL("http://localhost");
  return toUrl(dummyBase, route).pathname;
};

export const Route = {
  fromUrl,
  toUrl,
  toHref,
};
