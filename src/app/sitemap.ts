import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.cakrawalaintiteknik.com";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const articles = await db.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/#insight`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
