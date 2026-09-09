"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MarcoNavegador } from "./Marcos";
import { funciones } from "./datos";

/**
 * Recorrido por el panel.
 *
 * Se eligió una lista de pestañas con una sola captura grande en vez de una
 * grilla de tarjetas: las capturas son apaisadas y densas, y en una grilla de
 * seis quedarían ilegibles. Acá el visitante lee el nombre de la función y ve
 * la pantalla real al tamaño en que se usa.
 */
export default function Funciones() {
  const [activa, setActiva] = useState(0);
  const f = funciones[activa];

  return (
    <section id="funciones" className="relative border-t border-line/70 py-24 lg:py-32">
      <div className="shell">
        <header className="max-w-[46ch]">
          <div className="font-mono-up mb-4 text-blue">§ El panel</div>
          <h2
            className="font-display font-semibold leading-[0.98] tracking-tightest"
            style={{ fontSize: "clamp(34px, 5vw, 62px)" }}
          >
            Seis pantallas.
            <br />
            <span className="font-medium italic text-mute">Ninguna planilla.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.6] text-mute">
            Todo lo que sigue son capturas del producto funcionando, no maquetas. Son exactamente las
            pantallas que vas a usar el lunes a la mañana.
          </p>
        </header>

        <div className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-14">
          {/* Escritorio: lista vertical. Móvil: tira horizontal con snap. */}
          <div
            role="tablist"
            aria-label="Funciones del panel"
            className="no-scrollbar -mx-[22px] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[22px] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-line lg:px-0"
          >
            {funciones.map((item, i) => {
              const seleccionada = i === activa;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={seleccionada}
                  aria-controls={`panel-${item.id}`}
                  id={`tab-${item.id}`}
                  onClick={() => setActiva(i)}
                  className={`group relative shrink-0 snap-start rounded-xl border px-4 py-3 text-left transition-colors lg:w-full lg:rounded-lg lg:border-0 lg:py-4 lg:pl-6 lg:pr-4 ${
                    seleccionada
                      ? "border-ink bg-ink text-paper lg:bg-cream lg:text-ink"
                      : "border-line text-mute hover:border-ink/30 lg:hover:text-ink"
                  }`}
                >
                  {/* Marcador sobre el filete de la lista. Un punto y no un
                      borde grueso de color: el mismo lenguaje que el punto sol
                      de la nav y las viñetas de más abajo. */}
                  <span
                    className={`absolute left-0 top-[1.55rem] hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors lg:block ${
                      seleccionada ? "bg-blue" : "bg-line group-hover:bg-soft"
                    }`}
                    aria-hidden
                  />
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`font-mono text-[10px] tracking-[.14em] ${
                        seleccionada ? "text-blue lg:text-blue" : "text-soft"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[15px] font-semibold tracking-tight lg:text-[17px]">
                      {item.etiqueta}
                    </span>
                  </span>
                  {/* La descripción sólo entra en escritorio: en la tira móvil
                      convertiría cada pestaña en un párrafo. */}
                  <span
                    className={`mt-1.5 hidden text-[13px] leading-[1.45] lg:block ${
                      seleccionada ? "text-ink/70" : "text-soft"
                    }`}
                  >
                    {item.titulo}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${f.id}`}
            aria-labelledby={`tab-${f.id}`}
            className="min-w-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.2, 0.65, 0.3, 0.95] }}
              >
                <MarcoNavegador src={f.imagen} alt={f.alt} />

                <div className="mt-7 grid gap-6 md:grid-cols-[1.5fr_1fr] md:gap-10">
                  <div>
                    <h3 className="font-display text-[21px] font-semibold leading-tight tracking-tight text-ink lg:text-[25px]">
                      {f.titulo}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.6] text-mute">{f.texto}</p>
                  </div>
                  <ul className="space-y-2.5 md:pt-1.5">
                    {f.puntos.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-ink/80">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
