import { html } from "../core/html.ts";
import { href } from "../route.ts";

export const viewTopBar = (input: { end?: string }) => {
  return html` <header>
    <nav>
      <ul>
        <li>
          <a href="${href({ t: "todo", c: { t: "list-view-all" } })}">
            <strong>Todo</strong>
          </a>
        </li>
      </ul>
      <ul>
        ${input.end}
      </ul>
    </nav>
  </header>`;
};
