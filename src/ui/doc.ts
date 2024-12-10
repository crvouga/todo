import { html } from "../core/html.ts";

export const viewDoc = (input: { body: string }) => html`
  <html>
    <head>
      <title>Todo</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
    </head>
    <body>
      ${input.body}
    </body>
  </html>
`;

export const respondDoc = (input: { body: string }) => {
  return new Response(viewDoc(input), {
    headers: {
      "content-type": "text/html",
    },
  });
};
