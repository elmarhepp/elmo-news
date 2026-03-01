export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.user?.id;
  const feedId = getRouterParam(event, "id")!;
  const { isActive, subscribe } = await readBody(event);

  if (subscribe === true) {
    await prisma.userFeed.upsert({
      where: { userId_feedId: { userId, feedId } },
      update: { isActive: true },
      create: { userId, feedId, isActive: true },
    });
    return { ok: true };
  }

  if (subscribe === false) {
    await prisma.userFeed.deleteMany({ where: { userId, feedId } });
    return { ok: true };
  }

  return await prisma.userFeed.update({
    where: { userId_feedId: { userId, feedId } },
    data: { isActive },
  });
});
