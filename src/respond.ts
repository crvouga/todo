import { html, responseHtml } from "./core/html.ts";
import { ICtx } from "./ctx.ts";
import { Route, href } from "./route.ts";
import * as Todo from "./todo/index.ts";
import { viewDoc } from "./ui/doc.ts";

export const respond = async (input: {
  ctx: ICtx;
  route: Route;
  req: Request;
}): Promise<Response> => {
  switch (input.route?.t) {
    case "index": {
      return responseHtml(viewDoc({ body: viewIndex() }));
    }

    case "todo": {
      return await Todo.respond({ ...input, route: input.route.c });
    }
  }
};

const viewIndex = () => html`
  <main>
    <section>
      <h1>Not found</h1>
      <a role="button" href="${href({ t: "todo", c: { t: "index" } })}">
        Go to todo
      </a>
    </section>
  </main>
`;
