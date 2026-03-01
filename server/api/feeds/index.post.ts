export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.user?.id;
  const { name, url } = await readBody(event);

  if (!name || !url) {
    throw createError({ statusCode: 400, statusMessage: "Name und URL sind erforderlich" });
  }

  try {
    new URL(url);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Ungültige URL" });
  }

  const feed = await prisma.feed.upsert({
    where: { url },
    update: {},
    create: { name, url, isDefault: false },
  });

  await prisma.userFeed.upsert({
    where: { userId_feedId: { userId, feedId: feed.id } },
    update: { isActive: true },
    create: { userId, feedId: feed.id, isActive: true },
  });

  return feed;
});
