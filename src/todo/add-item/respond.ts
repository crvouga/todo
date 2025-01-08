import { html } from "../../core/html.ts";
import { redirect } from "../../core/http/redirect.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { TodoListId } from "../todo-list/todo-list-id.ts";
import { TodoList } from "../todo-list/todo-list.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  listId: TodoListId | null;
}): Promise<Response> => {
  switch (input.req.method) {
    case "POST": {
      return await respondPost(input);
    }

    default: {
      return respondDoc({ body: viewForm() });
    }
  }
};

const respondPost: typeof respond = async (input) => {
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

const viewForm = () => html`
  ${viewTopBar({})}
  <main>
    <section>
      <h1>Add New Item</h1>
      <form method="POST">
        <fieldset>
          <label>
            List
            <select type="text" name="list" disabled>
              <option>List</option>
            </select>
          </label>
        </fieldset>
        <fieldset>
          <label>
            Label
            <input type="text" name="label" required />
          </label>
        </fieldset>
        <button type="submit">Add</button>
      </form>
    </section>
  </main>
`;

export const AddListItem = {
  respond,
};
