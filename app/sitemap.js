const SITE = "https://operonhub.com";

export default function sitemap() {
  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/contanos-tu-proceso`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
