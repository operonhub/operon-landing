import { getPublishedArticles } from "@/lib/radar";

const SITE = "https://operonhub.com";

export default function sitemap() {
  const articles = getPublishedArticles();
  const latestRadarDate = articles.reduce((latest, article) => {
    const articleDate = article.updatedAt || article.publishedAt;
    return articleDate > latest ? articleDate : latest;
  }, "");

  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      // Misma pagina que sirve reservas.operonhub.com (ver middleware.js).
      url: `${SITE}/reservas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/contanos-tu-proceso`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/radar`,
      ...(latestRadarDate ? { lastModified: latestRadarDate } : {}),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${SITE}/radar/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
