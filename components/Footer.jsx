"use client";
import Link from "next/link";
import { Wordmark } from "./BalloonMark";

const columns = [
  {
    heading: "Compañía",
    links: [
      { label: "Servicios",      href: "/#servicios" },
      { label: "Proyectos",      href: "/#proyectos" },
      { label: "Proceso",        href: "/#proceso" },
      { label: "Por qué Operon", href: "/#diferencial" },
    ],
  },
  {
    heading: "Recursos",
    links: [
      { label: "Operon Reservas",   href: "/reservas" },
      { label: "Casos completos",   href: "/#proyectos" },
      { label: "Stack tecnológico", href: "/#servicios" },
      { label: "Política de datos", href: "/privacidad" },
    ],
  },
  {
    heading: "Contacto",
    links: [
      { label: "admin@operonhub.com", href: "mailto:admin@operonhub.com" },
      { label: "Buenos Aires, AR",    href: null },
      { label: "Instagram",           href: "https://www.instagram.com/operonhub/", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="shell pt-20 pb-10">
        <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-paper/10">
          <div>
            <div className="text-paper">
              <Wordmark fontSize={22} color="#FBF9F4" accent="#F2C94C" />
            </div>
            <p className="mt-4 text-[14px] leading-[1.55] text-paper/55 max-w-[34ch]">
              Automatizaciones, SaaS y software a medida. Construidos en Argentina, para pymes
              argentinas. Y para algunas que no.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="pt-1">
              <h3 className="font-mono-up text-paper/40 mb-6 pb-3 border-b border-paper/10">
                {col.heading}
              </h3>
              {col.links.map(({ label, href, external }) => {
                if (!href) {
                  return (
                    <span key={label} className="block text-[14px] text-paper/50 py-2 cursor-default">
                      {label}
                    </span>
                  );
                }
                if (external) {
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[14px] text-paper/80 py-2 hover:text-sol transition-colors"
                    >
                      {label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={label}
                    href={href}
                    className="block text-[14px] text-paper/80 py-2 hover:text-sol transition-colors"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-6">
          <span className="font-mono-up text-paper/40">© 2026 Operon · Identidad v1.0</span>
          <span className="font-mono-up text-paper/40">Hecho con cuidado, en BUE.</span>
        </div>
      </div>
    </footer>
  );
}
