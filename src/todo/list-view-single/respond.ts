import { html } from "../../core/html.ts";
import { pipe } from "../../core/pipe.ts";
import { mapOk, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { TodoItem } from "../item/item.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoList } from "../list/list.ts";
import { Route } from "../route.ts";

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
  const items = pipe(
    await input.ctx.todoItemDb.list({
      listId: input.listId,
    }),
    (result) => mapOk(result, (paginated) => paginated.items),
    (result) => unwrapOr(result, [])
  );

  return respondDoc({ preload, body: viewSingle({ list, items }) });
};

const viewSingle = (input: { list: TodoList | null; items: TodoItem[] }) => {
  const { list, items } = input;
  if (!list) {
    return html` ${viewTopBar({})}
      <main>
        <section><h1>List not found</h1></section>
      </main>`;
  }
  return html`
    ${viewTopBar({
      end: html`<li>${viewAddNewItem({ listId: list.id })}</li>`,
    })}
    <main>
      <section>
        <h1>${list.name}</h1>
        ${items.length === 0
          ? html`<p>
              No items found in this list. You can add new items using the
              button above.
            </p>`
          : ""}
        <ul>
          ${items.map((item) => viewItem({ item })).join("\n")}
        </ul>
      </section>
    </main>
  `;
};

const viewItem = (input: { item: TodoItem }) => html`
  <li>${input.item.label} ${viewDeleteItemButton({ item: input.item })}</li>
`;

const viewDeleteItemButton = (input: { item: TodoItem }) =>
  html`
    <form
      action="${href({
        t: "todo",
        c: {
          t: "item-delete",
          itemId: input.item.id,
        },
      })}"
      method="POST"
      style="display: inline;"
    >
      <button type="submit" role="button">Delete</button>
    </form>
  `;

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
