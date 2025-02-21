import { html } from "../../core/html.ts";
import { href } from "../../route.ts";
import { TodoListId } from "../list/list-id.ts";

export type ItemFilter = "all" | "pending" | "done";

const ALL: ItemFilter[] = ["all", "pending", "done"];

const encode = (filter: ItemFilter): string => {
  return filter;
};

const decode = (filter: unknown): ItemFilter => {
  const cleaned = typeof filter === "string" ? filter.trim().toLowerCase() : "";
  if (cleaned.includes("pending")) {
    return "pending";
  }
  if (cleaned.includes("done")) {
    return "done";
  }
  return "all";
};

const viewButtonGroup = (input: {
  filter: ItemFilter;
  listId: TodoListId;
  pendingCount: number;
  doneCount: number;
}): string => {
  const allCount = input.pendingCount + input.doneCount;
  return html`
    <div role="group">
      <a
        role="button"
        class="${input.filter === "all" ? "" : "outline"}"
        href="${href({
          t: "todo",
          c: { t: "list-view", listId: input.listId, itemFilter: "all" },
        })}"
      >
        <!--  -->
        All (${String(allCount)})
      </a>
      <a
        role="button"
        class="${input.filter === "pending" ? "" : "outline"}"
        href="${href({
          t: "todo",
          c: { t: "list-view", listId: input.listId, itemFilter: "pending" },
        })}"
      >
        <!--  -->
        Pending (${String(input.pendingCount)})
      </a>
      <a
        role="button"
        class="${input.filter === "done" ? "" : "outline"}"
        href="${href({
          t: "todo",
          c: { t: "list-view", listId: input.listId, itemFilter: "done" },
        })}"
      >
        <!--  -->
        Done (${String(input.doneCount)})
      </a>
    </div>
  `;
};

export const ItemFilter = {
  encode,
  decode,
  viewButtonGroup,
  ALL,
};
