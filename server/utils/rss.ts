import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "elmo-news/1.0 RSS Reader" },
});

export interface Article {
  id: string;
  feedId: string;
  feedName: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
}

export async function fetchFeedArticles(
  feedId: string,
  feedName: string,
  feedUrl: string,
  limit = 20
): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, limit).map((item, index) => ({
      id: `${feedId}-${item.guid ?? item.link ?? index}`,
      feedId,
      feedName,
      title: item.title ?? "Kein Titel",
      link: item.link ?? "#",
      summary: stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? ""),
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date(0).toISOString(),
    }));
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim().slice(0, 300);
}
