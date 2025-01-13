import { ICtx } from "../../ctx.ts";
import { TodoListId } from "../list/list-id.ts";
import { Route } from "../route.ts";

const respond = async (_input: {
  ctx: ICtx;
  req: Request;
  route: Route;
  listId: TodoListId | null;
}): Promise<Response> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Response("list-edit", {
    headers: { "content-type": "text/plain" },
  });
};

export const ListEdit = {
  respond,
};
