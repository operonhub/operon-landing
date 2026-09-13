import Link from "next/link";

import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RadarCard from "@/components/radar/RadarCard";
import RadarEmpty from "@/components/radar/RadarEmpty";
import { getPublishedArticles, RADAR_CATEGORIES } from "@/lib/radar";

const SITE = "https://operonhub.com";

export const metadata = {
  title: "Radar Operon — IA y tecnología aplicada a operaciones",
  description:
    "Análisis de IA, automatización y tecnología aplicada a empresas de Argentina y Latinoamérica, con implicancias concretas y sin humo.",
  alternates: { canonical: `${SITE}/radar` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE}/radar`,
    title: "Radar Operon — IA y tecnología aplicada a operaciones",
    description:
      "Qué cambia, qué importa y qué conviene hacer para empresas de Argentina y Latinoamérica.",
    siteName: "Operon",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radar Operon — IA y tecnología aplicada a operaciones",
    description:
      "Qué cambia, qué importa y qué conviene hacer para empresas de Argentina y Latinoamérica.",
  },
};

export default function RadarPage({ searchParams }) {
  const requestedCategory = typeof searchParams?.categoria === "string" ? searchParams.categoria : "";
  const activeCategory = RADAR_CATEGORIES.includes(requestedCategory) ? requestedCategory : "Todo";
  const published = getPublishedArticles();
  const filtered = activeCategory === "Todo" ? published : published.filter((article) => article.category === activeCategory);
  const featured = filtered.find((article) => article.featured) || filtered[0];
  const rest = featured ? filtered.filter((article) => article.slug !== featured.slug) : [];

  return (
    <>
      <Nav />
      <main className="bg-paper text-ink">
        <header className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0 dot-grid opacity-30" aria-hidden />
          <div className="absolute -right-48 -top-64 h-[640px] w-[640px] rounded-full bg-blue/10 blur-3xl" aria-hidden />
          <div className="shell relative py-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
              <div>
                <div className="font-mono-up mb-5 text-blue">RADAR OPERON</div>
                <h1 className="max-w-[13ch] font-display font-semibold leading-[.94] tracking-tightest" style={{ fontSize: "clamp(48px, 7vw, 92px)" }}>
                  IA y tecnología, <span className="italic font-medium text-mute">llevadas a la operación.</span>
                </h1>
              </div>
              <p className="max-w-[48ch] text-[17px] leading-[1.65] text-mute lg:pb-2">
                Qué cambia, qué importa y qué conviene hacer para empresas de Argentina y Latinoamérica.
              </p>
            </div>
          </div>
        </header>

        <section className="shell py-16 lg:py-20" aria-labelledby="radar-archive-title">
          <h2 id="radar-archive-title" className="sr-only">Archivo de Radar Operon</h2>
          <nav aria-label="Filtrar artículos por categoría" className="mb-10 border-b border-line pb-5">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {["Todo", ...RADAR_CATEGORIES].map((category) => {
                const active = category === activeCategory;
                const href = category === "Todo" ? "/radar" : { pathname: "/radar", query: { categoria: category } };
                return (
                  <Link
                    key={category}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 font-mono-up ${active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-mute hover:border-ink hover:text-ink"}`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </nav>

          {featured ? (
            <>
              <div className="mb-8 flex items-center gap-3 font-mono-up text-mute">
                <span className="h-px w-6 bg-blue" aria-hidden />
                {activeCategory === "Todo" ? "Lectura destacada" : activeCategory}
              </div>
              <div className="grid overflow-hidden rounded-3xl border border-line bg-paper lg:grid-cols-[.82fr_1.18fr]">
                <div className="relative min-h-64 overflow-hidden border-b border-paper/15 lg:min-h-[430px] lg:border-b-0 lg:border-r">
                  <div className="absolute inset-0 bg-ink" aria-hidden />
                  <div className="absolute inset-0 dot-grid-dark opacity-40" aria-hidden />
                  <div className="absolute left-7 top-7 font-mono-up text-paper/45">OPERON / SIGNAL</div>
                  <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-10" aria-hidden>
                    <div className="mb-5 flex items-end gap-2">
                      {[28, 45, 34, 67, 48, 76, 59, 88].map((height, index) => (
                        <span key={index} className="flex-1 bg-blue" style={{ height: `${height * 2}px`, opacity: .35 + index * .07 }} />
                      ))}
                    </div>
                    <div className="h-px bg-paper/20"><div className="h-px w-3/4 bg-sol" /></div>
                  </div>
                </div>
                <article className="flex flex-col justify-between p-8 text-ink lg:p-12">
                  <div>
                    <div className="flex flex-wrap gap-x-3 gap-y-2 font-mono-up text-mute">
                      <span className="text-blue">{featured.category}</span>
                      <span aria-hidden>·</span>
                      <span>{featured.readingMinutes} min de lectura</span>
                    </div>
                    <h2 className="mt-7 font-display text-[36px] font-semibold leading-[1.02] tracking-tight lg:text-[54px]">
                      {featured.title}
                    </h2>
                    <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.7] text-mute">{featured.excerpt}</p>
                  </div>
                  <Link href={`/radar/${featured.slug}`} className="group mt-10 inline-flex min-h-11 items-center self-start font-display font-semibold text-ink hover:text-blue">
                    Leer el análisis <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </Link>
                </article>
              </div>

              {rest.length > 0 && (
                <div className="mt-16">
                  <div className="mb-8 flex items-center justify-between border-b border-ink pb-4">
                    <h2 className="font-display text-[28px] font-semibold tracking-tight">Más lecturas</h2>
                    <span className="font-mono-up text-mute">{String(rest.length).padStart(2, "0")}</span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                    {rest.map((article, index) => <RadarCard key={article.slug} article={article} variant={index + 1} />)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <RadarEmpty filtered={activeCategory !== "Todo"} />
          )}
        </section>
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
