import { html } from "../core/html.ts";

export const viewTopBar = (input: { end?: string }) => {
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
