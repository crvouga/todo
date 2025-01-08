import { Ctx } from "./src/ctx.ts";
import { respond } from "./src/respond.ts";
import { Route } from "./src/route.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");

const ctx = await Ctx();

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  const route = Route.fromUrl(url);
  if (!route) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  console.log(req.method, route);
  const res = await respond({
    ctx,
    route,
    req,
  });
  return res;
});
