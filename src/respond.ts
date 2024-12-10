import { html } from "./core/html.ts";
import { ICtx } from "./ctx.ts";
import { Route } from "./route.ts";
import * as Todo from "./todo/index.ts";
import { viewDoc } from "./ui/doc.ts";

const viewIndex = () => html`
  <main>
    <section>
      <h1>Not found</h1>
    </section>
  </main>
`;

export const respond = async (input: {
  ctx: ICtx;
  route: Route;
  req: Request;
}): Promise<Response> => {
  switch (input.route?.t) {
    case "index": {
      return new Response(viewDoc({ body: viewIndex() }), {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    case "todo": {
      return await Todo.respond({ ...input, route: input.route.c });
    }
  }
};
