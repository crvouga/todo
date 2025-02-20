import { redirect } from "../../core/http/redirect.ts";
import { pipe } from "../../core/pipe.ts";
import { isErr, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { TodoItemId } from "../item/item-id.ts";
import { ItemFilter } from "../item/item-filter.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  itemId: TodoItemId | null;
  itemFilter: ItemFilter;
}): Promise<Response> => {
  switch (input.req.method) {
    case "POST":
    case "DELETE": {
      return await respondDelete(input);
    }

    default: {
      const listId = pipe(
        await input.ctx.todoItemDb.get(input.itemId),
        (_) => unwrapOr(_, null),
        (_) => _?.listId,
        (_) => _ ?? null
      );

      return redirect(
        href({
          t: "todo",
          c: { t: "list-view", listId, itemFilter: input.itemFilter },
        })
      );
    }
  }
};

const respondDelete: typeof respond = async (input) => {
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

  const zapped = await input.ctx.todoItemDb.zap(itemId);

  if (isErr(zapped)) {
    return new Response(String(zapped.v), {
      status: 500,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  return redirect(
    href({
      t: "todo",
      c: { t: "list-view", listId: item.listId, itemFilter: input.itemFilter },
    })
  );
};

export const ItemDelete = {
  respond,
};
