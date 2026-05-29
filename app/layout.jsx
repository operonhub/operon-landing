import "./globals.css";

export const metadata = {
  title: "Operon — Automatizaciones para pymes argentinas",
  description:
    "Software y automatizaciones que entendés y mantenés vos. Construidas en Argentina, para pymes que necesitan resolver hoy.",
  metadataBase: new URL("https://operon.ar"),
  openGraph: {
    title: "Operon — Automatizaciones que flotan",
    description:
      "Software especializado, SaaS y automatizaciones premium. Hechas en Argentina.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 78'><circle cx='28' cy='24' r='21' fill='none' stroke='%2314130F' stroke-width='6'/><circle cx='28' cy='24' r='5.4' fill='%23F2C94C'/><path d='M22 45 L34 45 L28 53 Z' fill='%2314130F'/><path d='M28 53 C 24 61, 35 64, 30 78' fill='none' stroke='%2314130F' stroke-width='3.4' stroke-linecap='round'/></svg>",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
