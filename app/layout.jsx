import "./globals.css";
import CosmicDot from "@/components/CosmicDot";

const SITE = "https://operonhub.com";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Operon — Automatizaciones para pymes argentinas",
    template: "%s · Operon",
  },
  description:
    "Software y automatizaciones que entendés y mantenés vos. Construidas en Argentina, para pymes que necesitan resolver hoy.",
  applicationName: "Operon",
  keywords: [
    "automatizaciones",
    "software a medida",
    "SaaS",
    "desarrollo web",
    "pymes",
    "Argentina",
    "n8n",
    "Next.js",
  ],
  authors: [{ name: "Operon", url: SITE }],
  creator: "Operon",
  publisher: "Operon",
  alternates: {
    canonical: `${SITE}/`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE,
    siteName: "Operon",
    title: "Operon — Automatizaciones que flotan",
    description:
      "Software especializado, SaaS y automatizaciones premium. Hechas en Argentina, para pymes argentinas.",
    // app/opengraph-image.png is picked up automatically by Next.js
  },
  twitter: {
    card: "summary_large_image",
    title: "Operon — Automatizaciones que flotan",
    description:
      "Software especializado, SaaS y automatizaciones premium. Hechas en Argentina.",
    // app/twitter-image.png is picked up automatically by Next.js
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // app/icon.png, app/apple-icon.png and app/favicon.ico are auto-detected
};

export const viewport = {
  themeColor: "#FBF9F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-paper text-ink antialiased">
        {children}
        <CosmicDot />
      </body>
    </html>
  );
}
