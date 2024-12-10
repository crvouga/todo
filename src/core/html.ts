export const html = (strings: TemplateStringsArray, ...values: unknown[]) => {
  return strings.reduce((acc, str, i) => {
    const value = values[i] || "";
    return acc + str + value;
  }, "");
};

export const responseHtml = (html: string) => {
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
};
