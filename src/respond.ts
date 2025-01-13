import { redirect } from "./core/http/redirect.ts";
import { ICtx } from "./ctx.ts";
import { Route, href } from "./route.ts";
import * as Todo from "./todo/index.ts";

export const respond = async (input: {
  ctx: ICtx;
  route: Route;
  req: Request;
}): Promise<Response> => {
  switch (input.route?.t) {
    case "home": {
      return redirect(href({ t: "todo", c: { t: "list-view-all" } }));
    }

    case "todo": {
      return await Todo.respond({ ...input, route: input.route.c });
    }
  }
};
