"use client";
import { Wordmark } from "../BalloonMark";
import { DEMO_URL } from "./datos";

const columnas = [
  {
    titulo: "Producto",
    links: [
      { label: "Funciones", href: "#funciones" },
      { label: "Sin doble reserva", href: "#sobreventa" },
      { label: "Comparación", href: "#comparacion" },
      { label: "Cómo se conecta", href: "#conexion" },
      { label: "Preguntas", href: "#preguntas" },
    ],
  },
  {
    titulo: "Operon",
    links: [
      { label: "operonhub.com", href: "https://operonhub.com/", externo: true },
      { label: "Otros proyectos", href: "https://operonhub.com/#proyectos", externo: true },
      { label: "Política de datos", href: "https://operonhub.com/privacidad", externo: true },
    ],
  },
  {
    titulo: "Contacto",
    links: [
      { label: "admin@operonhub.com", href: "mailto:admin@operonhub.com" },
      { label: "Instagram", href: "https://www.instagram.com/operonhub/", externo: true },
    ],
  },
];

export default function FooterReservas() {
  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="shell pb-10 pt-20">
        <div className="grid gap-12 border-b border-paper/10 pb-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-[19px] font-semibold tracking-tight text-paper">
              Operon Reservas
            </p>
            <p className="mt-4 max-w-[36ch] text-[14px] leading-[1.55] text-paper/55">
              Motor de reservas para cabañas, complejos y alojamientos chicos. Reservas directas
              desde tu propia web, sin comisión por reserva.
            </p>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-paper/25 px-4 py-2.5 font-display text-[13px] font-semibold text-paper hover:border-paper hover:bg-paper/10"
            >
              Ver la demo
              <span aria-hidden>→</span>
            </a>
          </div>

          {columnas.map((c) => (
            <div key={c.titulo} className="pt-1">
              <h2 className="font-mono-up mb-6 border-b border-paper/10 pb-3 text-paper/40">
                {c.titulo}
              </h2>
              {c.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-2 text-[14px] text-paper/80 transition-colors hover:text-sol"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="font-mono-up text-paper/40">© 2026 Operon · Reservas v1</span>
          {/* Sello de autoría de la marca: chiquito, sutil y siempre clickeable. */}
          <a
            href="https://operonhub.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-paper/45 transition-colors hover:text-paper"
          >
            <span className="font-mono-up">Hecho por</span>
            <Wordmark fontSize={15} color="currentColor" accent="#F2C94C" />
          </a>
        </div>
      </div>
    </footer>
  );
}
