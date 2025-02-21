import { html } from "../../core/html.ts";
import { pipe } from "../../core/pipe.ts";
import { mapOk, unwrapOr } from "../../core/result.ts";
import { ICtx } from "../../ctx.ts";
import { href } from "../../route.ts";
import { respondDoc } from "../../ui/doc.ts";
import { viewTopBar } from "../../ui/top-bar.ts";
import { TodoItem } from "../item/item.ts";
import { TodoListId } from "../list/list-id.ts";
import { TodoList } from "../list/list.ts";
import { Route } from "../route.ts";
import { ItemFilter } from "../item/item-filter.ts";

const respond = async (input: {
  ctx: ICtx;
  req: Request;
  route: Route;
  itemFilter: ItemFilter;
  listId: TodoListId | null;
}): Promise<Response> => {
  const preload = [
    href({
      t: "todo",
      c: { t: "item-add", listId: input.listId },
    }),
    href({ t: "todo", c: { t: "list-view-all" } }),
  ];

  if (!input.listId) {
    return respondDoc({
      preload,
      body: viewSingle({ list: null, itemFilter: input.itemFilter, items: [] }),
    });
  }

  const list = unwrapOr(await input.ctx.todoListDb.get(input.listId), null);
  const items = pipe(
    await input.ctx.todoItemDb.list({
      listId: input.listId,
      itemFilter: input.itemFilter,
    }),
    (result) => mapOk(result, (paginated) => paginated.items),
    (result) => unwrapOr(result, [])
  );

  return respondDoc({
    preload,
    body: viewSingle({ list, itemFilter: input.itemFilter, items }),
  });
};

const viewSingle = (input: {
  list: TodoList | null;
  itemFilter: ItemFilter;
  items: TodoItem[];
}) => {
  const { list, items } = input;
  if (!list) {
    return renderNotFound();
  }
  return html`
    ${viewTopBar({
      end: html`<li>${viewAddNewItem({ listId: list.id })}</li>`,
    })}
    <main class="container">
      <section class="container">
        <div
          style="display: flex; align-items: center; justify-content: space-between;"
        >
          <h1 style="flex: 1;">${list.name}</h1>
        </div>
        ${ItemFilter.viewButtonGroup({
          filter: input.itemFilter,
          listId: list.id,
        })}
        ${renderEmptyItemsState({ itemCount: items.length })}
        <ul
          style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px;"
        >
          ${items
            .map((item) => viewItem({ item, itemFilter: input.itemFilter }))
            .join("\n")}
        </ul>
      </section>
    </main>
  `;
};

const renderNotFound = () => {
  return html`
    ${viewTopBar({})}
    <main class="container">
      <section class="container"><h1>List not found</h1></section>
    </main>
  `;
};

const renderEmptyItemsState = (input: { itemCount: number }) => {
  if (input.itemCount > 0) {
    return "";
  }
  return html` <p>
    No items found in this list. You can add new items using the button above.
  </p>`;
};

const viewItem = (input: { item: TodoItem; itemFilter: ItemFilter }) => html`
  <li
    style="display: flex; align-items: center; justify-content: space-between; margin: 0;"
  >
    <div style="display: flex; align-items: center; gap: 8px;">
      ${viewToggleStatusButton({
        item: input.item,
        itemFilter: input.itemFilter,
      })}
      <h2
        style="${input.item.status === "done"
          ? "text-decoration: line-through; display: inline; margin: 0;"
          : "display: inline; margin: 0;"}"
      >
        ${input.item.label}
      </h2>
    </div>
    <div style="display: flex; gap: 8px; align-items: center;">
      ${viewDeleteItemButton({
        item: input.item,
        itemFilter: input.itemFilter,
      })}
    </div>
  </li>
`;

const viewAction = (input: { action: string; label: string }) => {
  return html`
    <form action="${input.action}" method="POST" style="margin: 0">
      <button style="margin: 0" type="submit" role="button">
        ${input.label}
      </button>
    </form>
  `;
};

const viewToggleStatusButton = (input: {
  item: TodoItem;
  itemFilter: ItemFilter;
}): string => {
  switch (input.item.status) {
    case "done":
      return viewMarkAsPendingButton({
        item: input.item,
        itemFilter: input.itemFilter,
      });
    case "pending":
      return viewMarkAsDoneButton({
        item: input.item,
        itemFilter: input.itemFilter,
      });
  }
};

const viewMarkAsDoneButton = (input: {
  item: TodoItem;
  itemFilter: ItemFilter;
}) => {
  return viewAction({
    action: href({
      t: "todo",
      c: {
        t: "item-mark-as-done",
        itemId: input.item.id,
        itemFilter: input.itemFilter,
      },
    }),
    label: "Pending",
  });
};

const viewMarkAsPendingButton = (input: {
  item: TodoItem;
  itemFilter: ItemFilter;
}) => {
  return viewAction({
    action: href({
      t: "todo",
      c: {
        t: "item-mark-as-pending",
        itemId: input.item.id,
        itemFilter: input.itemFilter,
      },
    }),
    label: "☑ Done",
  });
};

const viewDeleteItemButton = (input: {
  item: TodoItem;
  itemFilter: ItemFilter;
}) => {
  return viewAction({
    action: href({
      t: "todo",
      c: {
        t: "item-delete",
        itemId: input.item.id,
        itemFilter: input.itemFilter,
      },
    }),
    label: "Delete",
  });
};

const viewAddNewItem = (input: { listId: TodoListId }) => html`
  <a
    role="button"
    href="${href({ t: "todo", c: { t: "item-add", listId: input.listId } })}"
  >
    Add New Item
  </a>
`;

export const ListViewSingle = {
  respond,
};
