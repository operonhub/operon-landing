import Link from "next/link";

import { getPublishedArticles } from "@/lib/radar";
import RadarCard from "./RadarCard";

export default function RadarHome() {
  const articles = getPublishedArticles().slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section id="radar" aria-labelledby="radar-home-title" className="relative border-t border-line/70 bg-paper py-28 lg:py-36">
      <div className="shell">
        <div className="grid gap-8 border-b border-ink pb-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="font-mono-up mb-4 text-blue">RADAR OPERON</div>
            <h2
              id="radar-home-title"
              className="max-w-[13ch] font-display font-semibold leading-[.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
            >
              Lo que cambia. <span className="italic font-medium text-mute">Lo que conviene hacer.</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[57ch] text-[16px] leading-[1.65] text-mute">
              Lecturas sobre IA, automatización y tecnología aplicada a empresas que quieren operar mejor. Sin humo, con implicancias concretas para Argentina y Latinoamérica.
            </p>
            <Link href="/radar" className="mt-6 inline-flex min-h-11 items-center font-display font-semibold text-[14px] text-ink hover:text-blue">
              Ver todo el Radar <span className="ml-2" aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:grid-rows-2 lg:gap-8">
          {articles.map((article, index) => (
            <div key={article.slug} className={index === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}>
              <RadarCard article={article} variant={index} featured={index === 0} showSignal={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
