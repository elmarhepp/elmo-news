export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.user?.id;

  const activeUserFeeds = await prisma.userFeed.findMany({
    where: { userId, isActive: true },
    include: { feed: true },
  });

  if (activeUserFeeds.length === 0) return [];

  const results = await Promise.allSettled(
    activeUserFeeds.map((uf) => fetchFeedArticles(uf.feed.id, uf.feed.name, uf.feed.url))
  );

  const allArticles = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof fetchFeedArticles>>>).value);

  allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return allArticles;
});
