import { ICtx } from "../ctx.ts";
import { ItemAdd } from "./item-add/respond.ts";
import { ItemDelete } from "./item-delete/respond.ts";
import { ItemMarkAsDone } from "./item-mark-as-done/respond.ts";
import { ItemMarkAsPending } from "./item-mark-as-pending/respond.ts";
import { ListCreate } from "./list-create/respond.ts";
import { ListDelete } from "./list-delete/respond.ts";
import { ListEdit } from "./list-edit/respond.ts";
import { ListViewAll } from "./list-view-all/respond.ts";
import { ListViewSingle } from "./list-view-single/respond.ts";
import { Route } from "./route.ts";

export const respond = (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
}): Promise<Response> => {
  switch (input.route.t) {
    case "list-view-all": {
      return ListViewAll.respond(input);
    }

    case "list-view": {
      return ListViewSingle.respond({
        ...input,
        listId: input.route.listId,
        itemFilter: input.route.itemFilter,
      });
    }

    case "list-create": {
      return ListCreate.respond(input);
    }

    case "list-edit": {
      return ListEdit.respond({ ...input, listId: input.route.listId });
    }

    case "list-delete": {
      return ListDelete.respond({ ...input, listId: input.route.listId });
    }

    case "item-add": {
      return ItemAdd.respond({ ...input, listId: input.route.listId });
    }

    case "item-delete": {
      return ItemDelete.respond({
        ...input,
        itemId: input.route.itemId,
        itemFilter: input.route.itemFilter,
      });
    }

    case "item-mark-as-done": {
      return ItemMarkAsDone.respond({
        ...input,
        itemId: input.route.itemId,
        itemFilter: input.route.itemFilter,
      });
    }

    case "item-mark-as-pending": {
      return ItemMarkAsPending.respond({
        ...input,
        itemId: input.route.itemId,
        itemFilter: input.route.itemFilter,
      });
    }
  }
};
