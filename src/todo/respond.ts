import { html } from "../core/html.ts";
import { respondDoc } from "../ui/doc.ts";
import { Route } from "./route.ts";

export const respond = async (input: {
  req: Request;
  route: Route;
}): Promise<Response> => {
  switch (input.route.t) {
    case "index": {
      return respondDoc({ body: viewIndex() });
    }
    case "list-create": {
      return new Response("list-create", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }
    case "list-edit": {
      return new Response("list-edit", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }
    case "list-read": {
      return new Response("list-read", {
        headers: {
          "content-type": "text/plain",
        },
      });
    }
  }
};

const viewIndex = () => html`
  <header>
    <nav>
      <ul>
        <li><strong>Todo</strong></li>
      </ul>
      <ul>
        <li>
          <a href="#"><a role="button"> Create New </a></a>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <section>
      <h1>Lists</h1>
    </section>
    <section>
      <p>No lists found</p>
    </section>
  </main>
`;
