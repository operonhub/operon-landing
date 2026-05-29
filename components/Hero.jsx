"use client";
import { motion } from "framer-motion";
import BalloonMark from "./BalloonMark";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" aria-hidden />
      <div
        className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(31,64,194,.16), rgba(31,64,194,0) 70%)",
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[620px] h-[620px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(242,201,76,.18), rgba(242,201,76,0) 70%)",
        }}
        aria-hidden
      />

      <div className="shell relative pt-24 pb-28 lg:pt-28 lg:pb-36">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-9"
        >
          <span className="w-2 h-2 rounded-full bg-blue pulse-dot" />
          <span className="font-mono-up text-mute">v1.0 · disponible para nuevos proyectos · BUE / AR</span>
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-20 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}
              className="font-display font-semibold text-ink leading-[0.94] tracking-tightest"
              style={{ fontSize: "clamp(48px, 7.2vw, 104px)" }}
            >
              Software que <em className="not-italic text-blue">flota</em>.<br />
              <span className="italic font-medium text-mute">Procesos</span> que dejan de pesar.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 text-[17px] lg:text-[20px] leading-[1.5] text-ink/90 max-w-[52ch]"
            >
              Construimos <strong className="font-medium">automatizaciones, SaaS y software a medida</strong> para pymes que necesitan
              resolver hoy. Código limpio, infra moderna, y que lo entiendas vos — no un dashboard cerrado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 bg-ink text-paper font-display font-semibold text-[14.5px] px-5 py-3.5 rounded-xl hover:bg-blue"
              >
                Agendar una llamada
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#proyectos"
                className="inline-flex items-center gap-2 border border-ink/90 text-ink font-display font-semibold text-[14.5px] px-5 py-3.5 rounded-xl hover:bg-ink hover:text-paper"
              >
                Ver proyectos
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-5 font-mono-up text-mute"
            >
              <span>Argentina · 2026</span>
              <span className="w-4 h-px bg-line" />
              <span>+18 procesos en producción</span>
              <span className="w-4 h-px bg-line" />
              <span>0 vendor-lock</span>
            </motion.div>
          </div>

          {/* Hero art — flotando + grid orbital */}
          <div className="relative h-[420px] lg:h-[540px]">
            <HeroArt />
          </div>
        </div>
      </div>

      {/* Marquee de stack */}
      <div className="border-y border-line/70 bg-paper/60 backdrop-blur-sm">
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-14 py-5 whitespace-nowrap font-mono-up text-mute">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-14 shrink-0">
                {[
                  "Next.js", "Supabase", "Postgres", "TypeScript", "Stripe",
                  "n8n", "Vercel", "Resend", "Cloudflare", "Tailwind",
                  "Python · FastAPI", "OpenAI · Claude", "Whatsapp Cloud", "Hono", "Drizzle",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue/60" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative w-full h-full">
      {/* Orbital rings */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1F40C2" stopOpacity=".5" />
            <stop offset="1" stopColor="#1F40C2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="260" fill="none" stroke="url(#ring)" strokeWidth="1" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="#14130F" strokeOpacity=".08" strokeWidth="1" />
        <circle cx="300" cy="300" r="140" fill="none" stroke="#14130F" strokeOpacity=".08" strokeWidth="1" />
      </svg>

      {/* Small floating nodes */}
      {[
        { x: "12%", y: "20%", d: 0, label: "lead.in" },
        { x: "82%", y: "18%", d: 0.2, label: "stripe.paid" },
        { x: "78%", y: "78%", d: 0.4, label: "wa.notify" },
        { x: "10%", y: "76%", d: 0.6, label: "crm.sync" },
      ].map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + n.d }}
          style={{ left: n.x, top: n.y }}
          className="absolute"
        >
          <div className="flex items-center gap-2 bg-paper/90 backdrop-blur border border-line rounded-full pl-2 pr-3 py-1.5 shadow-[0_2px_18px_rgba(20,19,15,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue" />
            <span className="font-mono-up text-ink/80">{n.label}</span>
          </div>
        </motion.div>
      ))}

      {/* Center balloon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.95] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="float">
          <BalloonMark size={220} color="#14130F" accent="#F2C94C" stroke={5.6} />
        </div>
      </motion.div>

      {/* Tiny ticker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink text-paper px-3 py-1.5 rounded-full"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sol" />
        <span className="font-mono-up text-[10px] tracking-[.16em]">SYSTEM · ONLINE</span>
      </motion.div>
    </div>
  );
}
