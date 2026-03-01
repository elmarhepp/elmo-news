import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultFeeds = [
  {
    name: "Heise Online",
    url: "https://www.heise.de/rss/heise-atom.xml",
    description: "IT-News, Testberichte und Hintergründe",
    isDefault: true,
  },
  {
    name: "Der Spiegel",
    url: "https://www.spiegel.de/schlagzeilen/tops/index.rss",
    description: "Aktuelle Nachrichten aus Politik, Wirtschaft und Kultur",
    isDefault: true,
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/rss",
    description: "Tech-News und Startups aus der Hacker-Community",
    isDefault: true,
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    description: "Technology, science, art, and culture",
    isDefault: true,
  },
  {
    name: "t3n",
    url: "https://t3n.de/rss.xml",
    description: "Digital Pioneer – Magazin für die digitale Wirtschaft",
    isDefault: true,
  },
];

async function main() {
  console.log("Seeding default feeds...");
  for (const feed of defaultFeeds) {
    await prisma.feed.upsert({
      where: { url: feed.url },
      update: {},
      create: feed,
    });
  }
  console.log(`${defaultFeeds.length} feeds seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
