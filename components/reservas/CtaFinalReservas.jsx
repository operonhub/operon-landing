"use client";
import { motion } from "framer-motion";
import BalloonMark from "../BalloonMark";
import { DEMO_URL } from "./datos";

export default function CtaFinalReservas() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-paper lg:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 460px at 82% 4%, rgba(31,64,194,.24), transparent 60%), radial-gradient(700px 360px at 4% 100%, rgba(242,201,76,.10), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.45fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono-up mb-6 flex items-center gap-3 text-paper/40"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-sol" />
            Demo abierta · sin registro
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-semibold leading-[0.96] tracking-tightest"
            style={{ fontSize: "clamp(40px, 6.2vw, 92px)" }}
          >
            Entrá y{" "}
            <em className="not-italic text-sol">tocá todo</em>.
            <br />
            <span className="font-medium italic text-paper/60">Después hablamos.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-paper/70"
          >
            La demo es el producto real corriendo con un alojamiento inventado: cargá una reserva,
            bloqueá fechas, movete por el calendario. No pide registro, no toca datos de nadie y no
            hay nada que puedas romper.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-paper px-5 py-3.5 font-display text-[14.5px] font-semibold text-ink hover:bg-sol"
            >
              Ver la demo
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </a>
            <button
              type="button"
              data-open-contact
              className="inline-flex items-center gap-2 rounded-xl border border-paper/30 px-5 py-3.5 font-display text-[14.5px] font-semibold text-paper hover:border-paper hover:bg-paper/10"
            >
              Agendar una llamada
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.95] }}
          className="hidden justify-center lg:flex"
        >
          <div className="float">
            <BalloonMark size={190} color="#FBF9F4" accent="#F2C94C" stroke={5.4} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
