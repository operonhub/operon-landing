"use client";
import { Wordmark } from "./BalloonMark";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-saturate-150 backdrop-blur bg-paper/85 border-b border-line/70">
      <div className="shell h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center text-ink">
          <Wordmark fontSize={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium">
          <a href="#servicios" className="hover:text-blue">Servicios</a>
          <a href="#proyectos" className="hover:text-blue">Proyectos</a>
          <a href="#proceso" className="hover:text-blue">Proceso</a>
          <a href="#diferencial" className="hover:text-blue">Por qué Operon</a>
          <a href="#faq" className="hover:text-blue">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-open-contact
            className="inline-flex items-center gap-1.5 bg-ink text-paper font-display font-semibold text-[13px] px-3.5 py-2 rounded-lg hover:bg-blue"
          >
            Hablemos
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
