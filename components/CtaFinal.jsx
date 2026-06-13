"use client";
import { motion } from "framer-motion";
import BalloonMark from "./BalloonMark";

export default function CtaFinal() {
  return (
    <section id="contacto" className="relative bg-ink text-paper overflow-hidden py-32 lg:py-40">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 460px at 80% 0%, rgba(31,64,194,.22), transparent 60%), radial-gradient(700px 360px at 5% 100%, rgba(242,201,76,.08), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 dot-grid-dark opacity-30" aria-hidden />

      <div className="shell relative grid lg:grid-cols-[1.4fr_1fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono-up text-paper/40 mb-6 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-sol pulse-dot" />
            Cupos abiertos · Q2 2026
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-semibold leading-[0.96] tracking-tightest"
            style={{ fontSize: "clamp(48px, 7vw, 108px)" }}
          >
            Soltá lo que <em className="not-italic text-sol">pesa</em>.<br />
            <span className="italic font-medium text-paper/60">Construyamos algo que flote.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 text-[18px] leading-[1.55] text-paper/70 max-w-[48ch]"
          >
            Una llamada de 30 minutos. Te decimos si podemos ayudarte, qué costaría y cuándo arrancamos.
            Si no aplica, te recomendamos a alguien que sí.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              data-open-contact
              className="group inline-flex items-center gap-2 bg-sol text-ink font-display font-semibold text-[15px] px-5 py-4 rounded-xl hover:bg-[#FFD968]"
            >
              Agendar 30 min
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <a
              href="mailto:admin@operonhub.com"
              className="inline-flex items-center gap-2 border border-paper/30 text-paper font-display font-semibold text-[15px] px-5 py-4 rounded-xl hover:bg-paper hover:text-ink hover:border-paper"
            >
              admin@operonhub.com
            </a>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl border-t border-paper/10 pt-8">
            {[
              { k: "Tiempo de respuesta", v: "< 24h" },
              { k: "Primer demo", v: "7 días" },
              { k: "Stack", v: "Tuyo · open" },
              { k: "Soporte", v: "Humano" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-mono-up text-paper/40">{s.k}</div>
                <div className="mt-1 font-display text-paper text-[20px]">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Balloon visual */}
        <div className="relative hidden lg:flex items-center justify-center h-[460px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-[440px] h-[440px] rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(31,64,194,.25), rgba(31,64,194,0) 70%)",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="relative float"
          >
            <BalloonMark size={240} color="#FBF9F4" accent="#F2C94C" stroke={5.6} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
