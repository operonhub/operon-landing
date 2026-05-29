"use client";
import { Wordmark } from "./BalloonMark";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/10">
      <div className="shell pt-14 pb-8">
        <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-paper/10">
          <div>
            <div className="text-paper"><Wordmark fontSize={22} color="#FBF9F4" accent="#F2C94C" /></div>
            <p className="mt-4 text-[14px] leading-[1.55] text-paper/55 max-w-[34ch]">
              Automatizaciones, SaaS y software a medida. Construidos en Argentina, para pymes
              argentinas. Y para algunas que no.
            </p>
          </div>
          {[
            { h: "Compañía", links: ["Servicios", "Proyectos", "Proceso", "Por qué Operon"] },
            { h: "Recursos", links: ["Casos completos", "Stack tecnológico", "Política de datos"] },
            { h: "Contacto", links: ["hola@operon.ar", "Buenos Aires, AR", "LinkedIn", "GitHub"] },
          ].map((c) => (
            <div key={c.h}>
              <h4 className="font-mono-up text-paper/40 mb-4">{c.h}</h4>
              {c.links.map((l) => (
                <a key={l} href="#" className="block text-[14px] text-paper/80 py-1.5 hover:text-sol">
                  {l}
                </a>
              ))}
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
