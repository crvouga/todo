import { html } from "../../core/html.ts";
import { redirect } from "../../core/http/redirect.ts";
import { isErr, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { Route } from "../route.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoList } from "../list/list.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
  listId: TodoListId | null;
}): Promise<Response> => {
  switch (input.req.method) {
    case "POST":
    case "DELETE": {
      const formData = await input.req.formData();

      const listId = TodoListId.decode(formData.get("listId")?.toString());

      const zapped = await input.ctx.todoListDb.zap(listId);

      if (isErr(zapped)) {
        return new Response(String(zapped.v), {
          status: 500,
          headers: { "content-type": "text/plain" },
        });
      }

      return redirect(href({ t: "todo", c: { t: "list-view-all" } }, true));
    }

    default: {
      const preload = [href({ t: "todo", c: { t: "list-view-all" } })];

      const list = unwrapOr(await input.ctx.todoListDb.get(input.listId), null);

      if (!list) {
        return redirect(href({ t: "todo", c: { t: "list-view-all" } }));
      }

      return respondDoc({ preload, body: viewForm({ list }) });
    }
  }
};

const viewForm = (input: { list: TodoList | null }): string => {
  if (!input.list) {
    return html`<p>list not found</p>`;
  }

  return html`
    ${viewTopBar({})}
    <main class="container">
      <section class="container">
        <h1>Delete list forever?</h1>
        <p>Are you sure you want to delete this list? This cannot be undo.</p>
        <form method="POST" onsubmit="return confirm('Are you sure?')">
          <fieldset>
            <label>
              Name
              <input
                type="text"
                name="name"
                disabled
                value="${input.list.name}"
              />
            </label>

            <input type="hidden" name="listId" value="${input.list.id}" />
          </fieldset>
          <button type="submit">Delete</button>
        </form>
      </section>
    </main>
  `;
};

export const ListDelete = {
  respond,
};
