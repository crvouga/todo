import { html } from "../../core/html.ts";
import { redirect } from "../../core/http/redirect.ts";
import { pipe } from "../../core/pipe.ts";
import { isErr, mapOk, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { TodoItem } from "../item/item.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoItemId } from "../item/item-id.ts";
import { TodoList } from "../list/list.ts";

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
      const lists = pipe(
        await input.ctx.todoListDb.list(),
        (_) => mapOk(_, (_) => _.items),
        (_) => unwrapOr(_, [])
      );
      return respondDoc({ body: viewForm({ lists, selected: input.listId }) });
    }
  }
};

const respondPost: typeof respond = async (input) => {
  const formData = await input.req.formData();
  const listId = TodoListId.decode(formData.get("listId"));

  if (!listId) {
    return new Response("Invalid list id", {
      status: 400,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  const label = formData.get("label")?.toString() || "";

  if (label.trim().length === 0) {
    return new Response("Label is required", {
      status: 400,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  const itemNew: TodoItem = {
    id: TodoItemId.generate(),
    label,
    listId,
  };

  const put = await input.ctx.todoItemDb.put(itemNew);

  if (isErr(put)) {
    return new Response(String(put.v), {
      status: 500,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  return redirect(
    href({
      t: "todo",
      c: { t: "list-view", listId },
    })
  );
};

const viewForm = (input: {
  selected: TodoListId | null;
  lists: TodoList[];
}) => {
  return html`
    ${viewTopBar({})}
    <main>
      <section>
        <h1>Add New Item</h1>
        <form method="POST">
          <fieldset>
            <label>
              List
              <select type="text" name="listId">
                ${input.lists
                  .map(
                    (list) =>
                      html`<option
                        value="${list.id}"
                        ${list.id === input.selected ? "selected" : ""}
                      >
                        ${list.name.trim() || "List has no name"}
                      </option>`
                  )
                  .join("\n")}
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
};
export const ItemAdd = {
  respond,
};
