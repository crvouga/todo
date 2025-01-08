import { html } from "../core/html.ts";

export const viewDoc = (input: { body: string; preload: string[] }) => html`
  <html>
    <head>
      <title>Todo</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta charset="utf-8" />
      ${input.preload
        .map((url) => html`<link rel="prefetch" href=${url} as="document" />`)
        .join("")}
      <script>
        document.addEventListener("submit", (event) => {
          const form = event.target;
          if (form.tagName === "FORM") {
            const submitButton = form.querySelector("button[type='submit']");

            if (!form.checkValidity()) {
              event.preventDefault();
              if (submitButton) {
                submitButton.removeAttribute("aria-busy");
                submitButton.removeAttribute("disabled");
              }
              return;
            }

            if (submitButton) {
              submitButton.setAttribute("aria-busy", "true");
              setTimeout(() => {
                submitButton.setAttribute("disabled", "true");
              }, 0);
            }

            const onFormSubmitSuccess = () => {
              if (submitButton) {
                submitButton.removeAttribute("aria-busy");
                submitButton.removeAttribute("disabled");
              }
            };

            window.addEventListener("beforeunload", onFormSubmitSuccess, {
              once: true,
            });
          }
        });

        function swapInnerHTML(selector, url) {
          fetch(url)
            .then((res) => res.text())
            .then((html) => {
              const element = document.querySelector(selector);
              if (element) {
                element.innerHTML = html;
              }
            });
        }
      </script>
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
