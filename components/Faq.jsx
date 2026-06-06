"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "./faq-data";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-28 lg:py-36 border-t border-line/70">
      <div className="shell">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="font-mono-up text-blue mb-4">§ Preguntas frecuentes</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Lo que casi<br />
              <span className="italic font-medium text-mute">siempre nos</span>
              <br />preguntan.
            </h2>
            <p className="mt-6 text-[15.5px] leading-[1.55] text-mute max-w-[34ch]">
              ¿Tenés una que no está acá? Escribinos a{" "}
              <a href="mailto:admin@operonhub.com" className="text-blue hover:underline">
                admin@operonhub.com
              </a>{" "}
              y te respondemos en menos de 24 horas.
            </p>
          </div>

          <ul className="border-t border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-start gap-5">
                      <span className="font-mono-up text-soft pt-1.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display font-semibold text-[20px] lg:text-[26px] leading-[1.18] tracking-tight text-ink group-hover:text-blue transition-colors">
                        {f.q}
                      </span>
                    </span>
                    <span
                      className={`mt-1.5 shrink-0 w-7 h-7 rounded-full border border-line flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-ink border-ink" : "group-hover:border-ink"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={isOpen ? "#FBF9F4" : "currentColor"} strokeWidth="1.6" strokeLinecap="round">
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.95] }}
                        className="overflow-hidden"
                      >
                        <p className="pl-0 lg:pl-[52px] pr-8 pb-8 text-[15.5px] lg:text-[16.5px] leading-[1.65] text-mute max-w-[62ch]">
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
      </div>
    </section>
  );
}
