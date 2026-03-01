const PROTECTED = ["/api/feeds", "/api/articles"];

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));

  if (isProtected) {
    const session = await getUserSession(event);
    if (!session.user?.id) {
      throw createError({ statusCode: 401, statusMessage: "Nicht angemeldet" });
    }
  }
});
