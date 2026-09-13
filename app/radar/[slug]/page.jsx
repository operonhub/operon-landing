import Link from "next/link";
import { notFound } from "next/navigation";

import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RadarArticleBody from "@/components/radar/RadarArticleBody";
import RadarCard from "@/components/radar/RadarCard";
import RadarSignal from "@/components/radar/RadarSignal";
import {
  formatRadarDate,
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/radar";

const SITE = "https://operonhub.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }) {
  const article = getPublishedArticleBySlug(params.slug);
  if (!article) return { robots: { index: false, follow: false } };

  const canonical = `${SITE}/radar/${article.slug}`;
  const title = article.seo.title || article.title;
  const description = article.seo.description || article.excerpt;
  const images = article.seo.image ? [{ url: article.seo.image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: "Operon",
      locale: "es_AR",
      publishedTime: article.publishedAt,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

export default function RadarArticlePage({ params }) {
  const article = getPublishedArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const canonical = `${SITE}/radar/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: {
      "@type": article.author.name === "Operon" ? "Organization" : "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Operon",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: "es-AR",
    ...(article.seo.image ? { image: article.seo.image } : {}),
  };

  return (
    <>
      <Nav />
      <main className="bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <article>
          <header className="border-b border-line">
            <div className="shell py-14 lg:py-20">
              <nav aria-label="Migas de pan" className="mb-10 flex flex-wrap items-center gap-2 font-mono-up text-mute">
                <Link href="/radar" className="hover:text-blue">Radar Operon</Link>
                <span aria-hidden>/</span>
                <span className="text-ink">{article.category}</span>
              </nav>

              <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono-up text-mute">
                    <span className="text-blue">{article.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={article.publishedAt}>{formatRadarDate(article.publishedAt)}</time>
                    {article.updatedAt && (
                      <><span aria-hidden>·</span><span>Actualizado <time dateTime={article.updatedAt}>{formatRadarDate(article.updatedAt)}</time></span></>
                    )}
                    <span aria-hidden>·</span>
                    <span>{article.readingMinutes} min de lectura</span>
                  </div>
                  <h1 className="mt-7 max-w-[18ch] font-display font-semibold leading-[.97] tracking-tightest" style={{ fontSize: "clamp(42px, 6.2vw, 82px)" }}>
                    {article.title}
                  </h1>
                </div>
                <div>
                  <p className="max-w-[52ch] text-[18px] leading-[1.65] text-mute">{article.excerpt}</p>
                  <div className="mt-6 font-mono-up text-mute">
                    Por {article.author.name}{article.author.role ? ` · ${article.author.role}` : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="shell pb-10 lg:pb-16"><RadarSignal variant={1} framed /></div>
          </header>

          <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,720px)_220px] lg:justify-center lg:gap-20 lg:py-20">
            <div>
              <RadarArticleBody body={article.body} />

              <section aria-labelledby="sources-title" className="mt-16 border-t border-ink pt-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="sources-title" className="font-display text-[28px] font-semibold tracking-tight">Fuentes</h2>
                  <span className="font-mono-up text-mute">{String(article.sources.length).padStart(2, "0")}</span>
                </div>
                {article.sources.length > 0 ? (
                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {article.sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center justify-between gap-5 py-4 text-[15px] hover:text-blue">
                          <span>{source.title}{source.publisher ? ` · ${source.publisher}` : ""}</span>
                          <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 rounded-2xl border border-line bg-cream/50 p-5 text-[15px] leading-[1.6] text-mute">
                    Contenido editorial inicial de Operon. Esta pieza no resume una noticia ni cita fuentes externas.
                  </p>
                )}
              </section>
            </div>

            <aside className="h-fit border-t border-line pt-5 lg:sticky lg:top-28" aria-label="Datos del artículo">
              <div className="font-mono-up text-blue">Ficha / lectura</div>
              <dl className="mt-5 space-y-5 text-[13px]">
                <div><dt className="font-mono-up text-mute">Categoría</dt><dd className="mt-1.5">{article.category}</dd></div>
                <div><dt className="font-mono-up text-mute">Tiempo</dt><dd className="mt-1.5">{article.readingMinutes} minutos</dd></div>
                <div><dt className="font-mono-up text-mute">Etiquetas</dt><dd className="mt-2 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full border border-line bg-cream/60 px-2.5 py-1">{tag}</span>)}</dd></div>
              </dl>
            </aside>
          </div>
        </article>

        <section className="border-y border-line bg-cream/60 py-16 lg:py-20" aria-labelledby="article-cta-title">
          <div className="shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="font-mono-up mb-4 text-blue">Del criterio a la práctica</div>
              <h2 id="article-cta-title" className="max-w-[20ch] font-display text-[36px] font-semibold leading-[1.05] tracking-tight lg:text-[50px]">
                ¿Esto puede mejorar un proceso de tu empresa?
              </h2>
              <p className="mt-5 max-w-[58ch] leading-[1.65] text-mute">
                Contanos el caso. Lo revisamos con criterio operativo y te decimos si tiene sentido avanzar.
              </p>
            </div>
            <Link href="/contanos-tu-proceso" className="group inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 font-display font-semibold text-paper hover:bg-blue">
              Contanos tu proceso <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="shell py-16 lg:py-20" aria-labelledby="related-title">
            <div className="mb-8 flex items-center justify-between border-b border-ink pb-4">
              <h2 id="related-title" className="font-display text-[30px] font-semibold tracking-tight">Lecturas relacionadas</h2>
              <Link href="/radar" className="hidden font-mono-up text-mute hover:text-blue sm:block">Volver al Radar →</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
              {related.map((relatedArticle, index) => <RadarCard key={relatedArticle.slug} article={relatedArticle} variant={index + 1} showSignal={false} />)}
            </div>
            <Link href="/radar" className="mt-8 inline-flex min-h-11 items-center font-display font-semibold text-blue sm:hidden">← Volver al Radar</Link>
          </section>
        )}
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
