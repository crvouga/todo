import { assertEquals } from "jsr:@std/assert";
import { Route } from "./route.ts";

Deno.test("from and to url", () => {
  const base = new URL("http://localhost");
  const routes: Route[] = [
    {
      t: "index",
    },
    {
      t: "list-create",
    },
    {
      t: "list-edit",
      listId: "1",
    },
    {
      t: "list-read",
      listId: "1",
    },
  ];

  for (const route of routes) {
    assertEquals(Route.fromUrl(Route.toUrl(base, route)), route);
  }
});
