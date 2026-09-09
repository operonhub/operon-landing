"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { pasosHuesped } from "./datos";

const capas = [
  { k: "Tu web", d: "La que ya tenés, con tus fotos y tu dominio." },
  { k: "API pública", d: "Tres funciones: disponibilidad, propiedad y alta de reserva." },
  { k: "Base central", d: "Postgres con tus datos aislados del resto." },
  { k: "Tu panel", d: "Donde aparece la reserva, ya tarifada." },
];

export default function Conexion() {
  return (
    <section id="conexion" className="relative border-t border-line/70 py-24 lg:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <header>
            <div className="font-mono-up mb-4 text-blue">§ Cómo se conecta</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(34px, 5vw, 62px)" }}
            >
              Va abajo de tu web.
              <br />
              <span className="font-medium italic text-mute">No la reemplaza.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.6] text-mute">
              Tu sitio sigue siendo tuyo. Operon Reservas le agrega el buscador de fechas, el
              cálculo del precio, la toma de la reserva y el cobro de la seña. El huésped nunca sale
              de tu dominio a un marketplace donde lo esperan otras veinte cabañas.
            </p>
          </header>

          {/* El diagrama de capas. Cuatro escalones, no un círculo con flechas:
              lo que importa es que se lea el orden de arriba hacia abajo. */}
          <ol className="relative">
            {capas.map((c, i) => (
              <motion.li
                key={c.k}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="relative flex gap-5 pb-8 last:pb-0"
                style={{ paddingLeft: `${i * 22}px` }}
              >
                {/* Línea de continuidad entre escalones. */}
                {i < capas.length - 1 && (
                  <span
                    className="absolute top-9 w-px bg-line"
                    style={{ left: `${i * 22 + 15}px`, height: "calc(100% - 2.25rem)" }}
                    aria-hidden
                  />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper font-mono text-[10px] tracking-[.1em] text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="font-display text-[17px] font-semibold tracking-tight text-ink">
                    {c.k}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-[1.5] text-mute">{c.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Los tres pasos del huésped.
            En tres columnas las capturas quedaban a ~300px de ancho y no se
            leía una sola línea. En filas alternadas la imagen llega a ~700px:
            se distingue el buscador, los precios y el formulario, que es todo
            el punto de mostrarlas. */}
        <div className="mt-16 lg:mt-24">
          <h3 className="font-display text-[22px] font-semibold tracking-tight text-ink lg:text-[28px]">
            Lo que ve tu huésped
          </h3>

          <div className="mt-9 space-y-12 lg:space-y-16">
            {pasosHuesped.map((p, i) => (
              <motion.article
                key={p.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55 }}
                className="grid items-start gap-6 md:grid-cols-[1fr_1.5fr] md:gap-12"
              >
                <div className="md:sticky md:top-28">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[.14em] text-blue">{p.n}</span>
                    <h4 className="font-display text-[19px] font-semibold leading-tight tracking-tight text-ink lg:text-[23px]">
                      {p.titulo}
                    </h4>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-mute">
                    {p.texto}
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-line bg-cream shadow-[0_16px_50px_-28px_rgba(20,19,15,0.35)]">
                  <Image
                    src={p.imagen}
                    alt={p.alt}
                    width={p.ancho}
                    height={p.alto}
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="block h-auto w-full"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
