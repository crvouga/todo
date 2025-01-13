export const redirect = (url: string): Response => {
  return new Response(null, {
    status: 303,
    headers: {
      location: url,
    },
  });
};
