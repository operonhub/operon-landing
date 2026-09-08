"use client";
import { Wordmark } from "../BalloonMark";
import { DEMO_URL } from "./datos";

const secciones = [
  { label: "Funciones", href: "#funciones" },
  { label: "Sin doble reserva", href: "#sobreventa" },
  { label: "Comparación", href: "#comparacion" },
  { label: "Cómo se conecta", href: "#conexion" },
  { label: "Preguntas", href: "#preguntas" },
];

export default function NavReservas() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur backdrop-saturate-150">
      <div className="shell flex h-16 items-center justify-between gap-6">
        {/* El wordmark lleva a la home: en un subdominio es la única forma de
            volver al sitio principal, y la marca tiene que ser clickeable. */}
        <a href="https://operonhub.com/" className="flex shrink-0 items-baseline gap-2.5 text-ink">
          <Wordmark fontSize={21} />
          <span className="font-mono-up text-mute">Reservas</span>
        </a>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium lg:flex">
          {secciones.map((s) => (
            <a key={s.href} href={s.href} className="hover:text-blue">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            data-open-contact
            className="hidden rounded-lg border border-ink/20 px-3.5 py-2 font-display text-[13px] font-semibold text-ink hover:border-ink sm:inline-flex"
          >
            Hablemos
          </button>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 font-display text-[13px] font-semibold text-paper hover:bg-blue"
          >
            Ver la demo
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
