export const redirect = (url: string): Response => {
  return new Response(null, {
    status: 303,
    headers: {
      location: url,
    },
  });
};

export const redirectNoCache = (url: string): Response => {
  return new Response(null, {
    status: 303,
    headers: {
      Location: url,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
};
