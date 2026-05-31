import { faqs } from "./faq-data";

const SITE = "https://operonhub.com";

export default function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Operon",
      url: SITE,
      logo: `${SITE}/icon.png`,
      email: "hola@operonhub.com",
      description:
        "Automatizaciones, SaaS y software a medida para pymes. Construidos en Argentina, mantenibles por vos.",
      areaServed: "AR",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Buenos Aires",
        addressCountry: "AR",
      },
      knowsAbout: [
        "Automatizaciones",
        "Software a medida",
        "SaaS",
        "Desarrollo web",
        "n8n",
        "Next.js",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Operon",
      url: SITE,
      inLanguage: "es-AR",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
