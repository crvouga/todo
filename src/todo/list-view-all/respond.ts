import { html } from "../../core/html.ts";
import { pipe } from "../../core/pipe.ts";
import { mapOk, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { Route } from "../route.ts";
import { TodoList } from "../list/list.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
}): Promise<Response> => {
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
        <a
          role="button"
          class="outline"
          href="${href({
            t: "todo",
            c: { t: "list-delete", listId: input.list.id },
          })}"
        >
          Delete
        </a>
      </div>
    </article>
  `;
};

export const ListViewAll = {
  respond,
};
