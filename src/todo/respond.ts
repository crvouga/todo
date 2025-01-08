import { html } from "../core/html.ts";
import { redirect } from "../core/http/redirect.ts";
import { pipe } from "../core/pipe.ts";
import { mapOk, unwrapOr } from "../core/result.ts";
import { ICtx } from "../ctx.ts";
import { href } from "../route.ts";
import { respondDoc } from "../ui/doc.ts";
import { Route } from "./route.ts";
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

      return respondDoc({ body: viewIndex({ lists }) });
    }

    case "list-create": {
      switch (input.req.method) {
        case "POST": {
          return await respondPostCreateList(input);
        }

        default: {
          return respondDoc({ body: viewListCreate() });
        }
      }
    }

    case "list-edit": {
      return new Response("list-edit", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }

    case "list-view": {
      if (!input.route.listId) {
        return new Response("No id passed", {
          headers: {
            "content-type": "text/plain",
          },
        });
      }
      const list = unwrapOr(
        await input.ctx.todoListDb.get(input.route.listId),
        null
      );
      return new Response(JSON.stringify(list, null, 4), {
        headers: { "content-type": "text/plain" },
      });
    }
  }
};

const respondPostCreateList: typeof respond = async (input) => {
  const formData = await input.req.formData();
  const name = formData.get("name")?.toString();

  const listNew: TodoList = {
    id: TodoListId.generate(),
    name: name ?? "",
  };

  const put = await input.ctx.todoListDb.put(listNew);

  switch (put.t) {
    case "err": {
      return new Response(String(put.v), {
        status: 500,
        headers: {
          "content-type": "text/plain",
        },
      });
    }
    case "ok": {
      return redirect(
        href({
          t: "todo",
          c: { t: "index" },
        })
      );
    }
    default: {
      const _check: never = put;
      return _check;
    }
  }
};

const viewHeader = (input: { end?: string }) => {
  return html` <header>
    <nav>
      <ul>
        <li><strong>Todo</strong></li>
      </ul>
      <ul>
        ${input.end}
      </ul>
    </nav>
  </header>`;
};

const viewIndex = (input: { lists: TodoList[] }) => html`
  ${viewHeader({ end: html`<li>${viewCreateNewButton()}</li>` })}
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

const viewListCard = (input: { list: TodoList }) => html`
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

const viewListCreate = () => html`
  ${viewHeader({})}
  <main>
    <section>
      <h1>Create New List</h1>
      <form method="POST">
        <fieldset>
          <label>
            Name
            <input type="text" name="name" required />
          </label>
        </fieldset>
        <button type="submit">Create</button>
      </form>
    </section>
  </main>
`;
