"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "./datos";

export default function PreguntasReservas() {
  const [abierta, setAbierta] = useState(0);

  return (
    <section id="preguntas" className="relative border-t border-line/70 py-24 lg:py-32">
      <div className="shell grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <div className="font-mono-up mb-4 text-blue">§ Preguntas frecuentes</div>
          <h2
            className="font-display font-semibold leading-[0.98] tracking-tightest"
            style={{ fontSize: "clamp(34px, 5vw, 62px)" }}
          >
            Lo que preguntan
            <br />
            <span className="font-medium italic text-mute">antes de decir</span>
            <br />
            que sí.
          </h2>
          <p className="mt-6 max-w-[34ch] text-[15.5px] leading-[1.55] text-mute">
            ¿Te falta una? Escribinos a{" "}
            <a href="mailto:admin@operonhub.com" className="text-blue hover:underline">
              admin@operonhub.com
            </a>{" "}
            y te respondemos en menos de 24 horas.
          </p>
        </div>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const abierto = abierta === i;
            return (
              <li key={f.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setAbierta(abierto ? -1 : i)}
                  className="group flex w-full items-start justify-between gap-6 py-7 text-left"
                  aria-expanded={abierto}
                >
                  <span className="flex items-start gap-5">
                    <span className="font-mono-up shrink-0 pt-1.5 text-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[19px] font-semibold leading-[1.18] tracking-tight text-ink transition-colors group-hover:text-blue lg:text-[24px]">
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={`mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300 ${
                      abierto ? "rotate-45 border-ink bg-ink" : "group-hover:border-ink"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={abierto ? "#FBF9F4" : "currentColor"}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {abierto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.95] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-8 pr-8 text-[15.5px] leading-[1.65] text-mute lg:pl-[52px] lg:text-[16.5px]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
