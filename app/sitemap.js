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
      // Misma pagina que sirve reservas.operonhub.com (ver middleware.js).
      url: `${SITE}/reservas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
