export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session.user?.id;

  const feeds = await prisma.feed.findMany({
    include: {
      userFeeds: { where: { userId } },
    },
    orderBy: { name: "asc" },
  });

  return feeds.map((feed) => ({
    id: feed.id,
    name: feed.name,
    url: feed.url,
    description: feed.description,
    isDefault: feed.isDefault,
    isSubscribed: feed.userFeeds.length > 0,
    isActive: feed.userFeeds[0]?.isActive ?? false,
  }));
});
