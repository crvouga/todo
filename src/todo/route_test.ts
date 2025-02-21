import { assertEquals } from "jsr:@std/assert";
import { Route } from "./route.ts";
import { TodoListId } from "./list/list-id.ts";

Deno.test("from and to url", () => {
  const base = new URL("http://localhost");
  const routes: Route[] = [
    {
      t: "list-view-all",
    },
    {
      t: "list-create",
    },
    {
      t: "list-edit",
      listId: TodoListId.decode("1"),
    },
    {
      t: "list-view",
      listId: null,
      itemFilter: "all",
    },
  ];

  for (const route of routes) {
    assertEquals(Route.fromUrl(Route.toUrl(base, route)), route);
  }
});
