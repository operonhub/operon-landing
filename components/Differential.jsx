"use client";
import { motion } from "framer-motion";

const items = [
  { k: "01", t: "Código que es tuyo.", d: "Cero vendor-lock. Repo, infra y secretos pasan a tu organización el día uno." },
  { k: "02", t: "Mantenible por vos.", d: "Stack estándar (Next.js, Postgres, Node). Cualquier dev decente puede continuar." },
  { k: "03", t: "Precio fijo, alcance claro.", d: "Cotizamos por entregable. Si nos pasamos, lo absorbemos nosotros." },
  { k: "04", t: "Velocidad real.", d: "Equipo chico, decisiones rápidas. Primer demo en 7 días o no cobramos esa semana." },
  { k: "05", t: "Hecho en Argentina.", d: "Misma zona horaria, mismo idioma, mismas pymes que entendemos desde adentro." },
  { k: "06", t: "Mentalidad de producto.", d: "Pensamos cada automatización como un producto: con docs, métricas y roadmap." },
];

export default function Differential() {
  return (
    <section id="diferencial" className="relative py-28 lg:py-36 border-t border-line/70 bg-cream/40">
      <div className="shell">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-start mb-16">
          <div>
            <div className="font-mono-up text-blue mb-4">§ Por qué Operon</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              No somos una agencia.<br />
              <span className="italic font-medium text-mute">Tampoco un freelancer.</span>
            </h2>
          </div>
          <p className="text-[17px] leading-[1.55] text-mute max-w-[54ch] lg:pt-3">
            Somos un equipo chico de producto que construye software de calidad de Silicon Valley para
            pymes que no necesitan (ni pueden) pagar precios de Silicon Valley. Nos diferencian seis cosas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {items.map((it, i) => (
            <motion.div
              key={it.k}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-paper p-8 lg:p-10 group hover:bg-cream/60"
            >
              <div className="font-mono-up text-mute mb-7 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                {it.k}
              </div>
              <h3 className="font-display font-semibold text-[22px] lg:text-[24px] leading-[1.15] tracking-tight">
                {it.t}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-mute max-w-[36ch]">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
