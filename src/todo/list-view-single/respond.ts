import { html } from "../../core/html.ts";
import { unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { Route } from "../route.ts";
import { TodoItem } from "../item/item.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoList } from "../list/list.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
  listId: TodoListId | null;
}): Promise<Response> => {
  const preload = [
    href({
      t: "todo",
      c: { t: "item-add", listId: input.listId },
    }),
    href({ t: "todo", c: { t: "list-view-all" } }),
  ];

  if (!input.listId) {
    return respondDoc({
      preload,
      body: viewSingle({ list: null, items: [] }),
    });
  }

  const list = unwrapOr(await input.ctx.todoListDb.get(input.listId), null);

  return respondDoc({ preload, body: viewSingle({ list, items: [] }) });
};

const viewSingle = (input: { list: TodoList | null; items: TodoItem[] }) => {
  if (!input.list) {
    return html` ${viewTopBar({})}
      <main>
        <section><h1>List not found</h1></section>
      </main>`;
  }
  return html`
    ${viewTopBar({
      end: html`<li>${viewAddNewItem({ listId: input.list.id })}</li>`,
    })}
    <main>
      <section>
        <h1>${input.list.name}</h1>
      </section>
    </main>
  `;
};

const viewAddNewItem = (input: { listId: TodoListId }) => html`
  <a
    role="button"
    href="${href({ t: "todo", c: { t: "item-add", listId: input.listId } })}"
  >
    Add New Item
  </a>
`;

export const ListViewSingle = {
  respond,
};
