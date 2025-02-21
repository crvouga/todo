import { redirect } from "../../core/http/redirect.ts";
import { pipe } from "../../core/pipe.ts";
import { isErr, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { TodoItemId } from "../item/item-id.ts";
import { TodoItem } from "../item/item.ts";
const respond = async (input: {
  ctx: ICtx;
  req: Request;
  itemId: TodoItemId | null;
}): Promise<Response> => {
  switch (input.req.method) {
    case "POST": {
      return await respondPost(input);
    }

    default: {
      const listId = pipe(
        await input.ctx.todoItemDb.get(input.itemId),
        (_) => unwrapOr(_, null),
        (_) => _?.listId,
        (_) => _ ?? null
      );

      return redirect(href({ t: "todo", c: { t: "list-view", listId } }));
    }
  }
};

const respondPost: typeof respond = async (input) => {
  const itemId = input.itemId;

  if (!itemId) {
    return new Response("Invalid item id", {
      status: 400,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  const item = unwrapOr(await input.ctx.todoItemDb.get(itemId), null);

  if (!item) {
    return new Response("Item not found", {
      status: 404,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  const marked = TodoItem.markAsPending(item);

  const put = await input.ctx.todoItemDb.put(marked);

  if (isErr(put)) {
    return new Response(String(put.v), {
      status: 500,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  return redirect(
    href({ t: "todo", c: { t: "list-view", listId: item.listId } })
  );
};

export const ItemMarkAsPending = {
  respond,
};
