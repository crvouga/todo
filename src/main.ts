import { html } from "./core/html";

const viewDoc = (body: string) => html`
  <html>
    <head>
      <title>Todo</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
    </head>
    <body>
      ${body}
    </body>
  </html>
`;

const viewIndex = () => html`
  <main>
    <section>
      <h1>Todo</h1>
    </section>
  </main>
`;

export const main = () => {
  const server = Bun.serve({
    fetch(request, _server) {
      return new Response(viewDoc(viewIndex()), {
        headers: {
          "content-type": "text/html",
        },
      });
    },
  });

  console.log(`Server started at http://localhost:${server.port}`);
};
