import { html } from "../core/html.ts";
import { pipe } from "../core/pipe.ts";
import { mapOk, unwrapOr } from "../core/result.ts";
import { ICtx } from "../ctx.ts";
import { href } from "../route.ts";
import { respondDoc } from "../ui/doc.ts";
import { viewTopBar } from "../ui/top-bar.ts";
import { AddListItem } from "./add-item/respond.ts";
import { CreateList } from "./create-list/respond.ts";
import { Route } from "./route.ts";
import { TodoItem } from "./todo-item/todo-item.ts";
import { TodoListId } from "./todo-list/todo-list-id.ts";
import { TodoList } from "./todo-list/todo-list.ts";

export const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
}): Promise<Response> => {
  switch (input.route.t) {
    case "index": {
      const lists = pipe(
        await input.ctx.todoListDb.list(),
        (_) => mapOk(_, (v) => v.items),
        (_) => unwrapOr(_, [])
      );

      const preload = lists.map((list) =>
        href({ t: "todo", c: { t: "list-view", listId: list.id } })
      );
      preload.push(href({ t: "todo", c: { t: "list-create" } }));

      return respondDoc({
        body: viewIndex({ lists }),
        preload,
      });
    }

    case "list-create": {
      return CreateList.respond(input);
    }

    case "list-edit": {
      return new Response("list-edit", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }

    case "list-view": {
      const preload = [
        href({
          t: "todo",
          c: { t: "list-item-add", listId: input.route.listId },
        }),
        href({ t: "todo", c: { t: "index" } }),
      ];

      if (!input.route.listId) {
        return respondDoc({
          preload,
          body: viewSingle({ list: null, items: [] }),
        });
      }

      const list = unwrapOr(
        await input.ctx.todoListDb.get(input.route.listId),
        null
      );

      return respondDoc({ preload, body: viewSingle({ list, items: [] }) });
    }

    case "list-item-add": {
      return AddListItem.respond({ ...input, listId: input.route.listId });
    }
  }
};

const viewIndex = (input: { lists: TodoList[] }) => html`
  ${viewTopBar({ end: html`<li>${viewCreateNewButton()}</li>` })}
  <main>
    <section>
      <h1>Lists</h1>
    </section>
    <section>
      ${input.lists.map((list) => viewListCard({ list })).join("")}
    </section>
  </main>
`;

const viewCreateNewButton = () => html`
  <a role="button" href="${href({ t: "todo", c: { t: "list-create" } })}">
    Create New
  </a>
`;

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
    href="${href({
      t: "todo",
      c: { t: "list-item-add", listId: input.listId },
    })}"
  >
    Add New Item
  </a>
`;

const viewListCard = (input: { list: TodoList }) => {
  return html`
    <article>
      <h2>${input.list.name}</h2>
      <div>
        <a
          role="button"
          class="outline"
          href="${href({
            t: "todo",
            c: { t: "list-view", listId: input.list.id },
          })}"
        >
          View
        </a>
        <a role="button" class="outline">Delete</a>
      </div>
    </article>
  `;
};
