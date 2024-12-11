import { html } from "../core/html.ts";
import { redirect } from "../core/http/redirect.ts";
import { unwrapOr } from "../core/result.ts";
import { mapOk } from "../core/result.ts";
import { ICtx } from "../ctx.ts";
import { href } from "../route.ts";
import { respondDoc } from "../ui/doc.ts";
import { Route } from "./route.ts";
import { TodoList } from "./todo-list/todo-list.ts";

export const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
}): Promise<Response> => {
  switch (input.route.t) {
    case "index": {
      const lists = unwrapOr(
        mapOk(await input.ctx.todoListDb.list(), (v) => v.items),
        []
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
    case "list-read": {
      return new Response("list-read", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }
  }
};

const respondPostCreateList: typeof respond = async (input) => {
  const formData = await input.req.formData();
  const name = formData.get("name")?.toString();

  const listNew: TodoList = {
    id: Math.random().toString(36).slice(2),
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
  ${viewHeader({
    end: html`<li>
      <a
        role="button"
        href="${href({
          t: "todo",
          c: { t: "list-create" },
        })}"
      >
        Create New
      </a>
    </li>`,
  })}
  <main>
    <section>
      <h1>Lists</h1>
    </section>
    <section>
      ${input.lists
        .map((list) => {
          return html`
            <article>
              <h2>${list.name}</h2>
              <div>
                <a role="button" class="outline">View</a>
                <a role="button" class="outline">Delete</a>
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
  </main>
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
