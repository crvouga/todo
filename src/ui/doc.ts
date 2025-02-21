import { html } from "../core/html.ts";

export const viewDoc = (input: { body: string; preload: string[] }) => html`
  <html>
    <head>
      <title>Todo</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta charset="utf-8" />
      ${input.preload
        .map((url) => html`<link rel="prefetch" href=${url} as="document" />`)
        .join("")}
    </head>

    <body>
      ${input.body}
    </body>
  </html>
`;

export const respondDoc = (input: { body: string; preload?: string[] }) => {
  return new Response(viewDoc({ ...input, preload: input.preload ?? [] }), {
    headers: {
      "content-type": "text/html",
    },
  });
};
