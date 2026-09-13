import Link from "next/link";

import { formatRadarDate } from "@/lib/radar";
import RadarSignal from "./RadarSignal";

export default function RadarCard({ article, variant = 0, featured = false, showSignal = true }) {
  return (
    <article className="h-full">
      <Link
        href={`/radar/${article.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-colors hover:border-ink/30 hover:bg-cream/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        aria-label={`Leer: ${article.title}`}
      >
        {showSignal && <RadarSignal variant={variant} compact={!featured} />}
        <div className={`flex flex-1 flex-col ${featured ? "p-8 lg:p-10" : "p-7 lg:p-8"}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono-up text-mute">
            <span className="text-blue">{article.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt}>{formatRadarDate(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} min</span>
          </div>
          <h3 className={`mt-5 font-display font-semibold leading-[1.04] tracking-tight ${featured ? "text-[30px] lg:text-[42px]" : "text-[25px] lg:text-[29px]"}`}>
            {article.title}
          </h3>
          <p className={`mt-4 max-w-[58ch] leading-[1.62] text-mute ${featured ? "text-[16px]" : "text-[15px]"}`}>
            {article.excerpt}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 self-start font-display font-semibold text-[14px] text-ink group-hover:text-blue">
            Leer análisis
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
