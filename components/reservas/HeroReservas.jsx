"use client";
import { motion } from "framer-motion";
import TypewriterWord from "../TypewriterWord";
import { MarcoNavegador } from "./Marcos";
import { DEMO_URL, reemplaza } from "./datos";

const stats = [
  { k: "0 %", v: "de comisión por reserva" },
  { k: "24/7", v: "tu web toma reservas sola" },
  { k: "0", v: "chances de vender dos veces" },
];

export default function HeroReservas() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-52 -top-52 h-[760px] w-[760px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(31,64,194,.16), rgba(31,64,194,0) 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-[38rem] h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(242,201,76,.20), rgba(242,201,76,0) 70%)" }}
        aria-hidden
      />

      <div className="shell relative pb-16 pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-start gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="pulse-dot h-2 w-2 rounded-full bg-blue" />
              <span className="font-mono-up text-mute">
                Producto Operon · motor de reservas para alojamientos
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}
              className="font-display font-semibold leading-[0.94] tracking-tightest text-ink"
              style={{ fontSize: "clamp(42px, 6.4vw, 92px)" }}
            >
              Tus reservas entran{" "}
              <em className="not-italic text-blue">
                {/* El punto va dentro del texto que se tipea: si queda afuera,
                    el cursor se mete entre la palabra y el punto. */}
                <TypewriterWord text="directo." startDelay={620} />
              </em>
              <br />
              <span className="font-medium italic text-mute">Sin comisión en el medio.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 max-w-[54ch] text-[17px] leading-[1.55] text-ink/90 lg:text-[19px]"
            >
              El motor de reservas que va <strong className="font-medium">abajo de tu propia web</strong>:
              disponibilidad real, seña por Mercado Pago y confirmaciones automáticas. Y la garantía
              de que nunca vas a vender dos veces la misma noche.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-display text-[14.5px] font-semibold text-paper hover:bg-blue"
              >
                Ver la demo
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </a>
              <button
                type="button"
                data-open-contact
                className="inline-flex items-center gap-2 rounded-xl border border-ink/90 px-5 py-3.5 font-display text-[14.5px] font-semibold text-ink hover:bg-ink hover:text-paper"
              >
                Quiero el mío
              </button>
              <span className="font-mono-up w-full text-soft sm:w-auto sm:pl-2">
                Datos ficticios · no pide registro
              </span>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7"
            >
              {stats.map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink lg:text-[32px]">
                    {s.k}
                  </dt>
                  <dd className="mt-2 text-[12.5px] leading-[1.4] text-mute">{s.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Columna derecha: lo que pasa cuando alguien reserva. Es la promesa
              del producto contada como evento, no como lista de features. */}
          <TarjetaReservaEntrante />
        </div>
      </div>

      {/* La captura grande, corrida a la derecha y con sangrado: se lee como una
          ventana que sigue más allá del borde, no como una foto pegada. */}
      <div className="relative">
        <div className="shell">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="relative mx-auto max-w-[1180px] lg:ml-[6%]"
          >
            <MarcoNavegador
              src="/reservas/panel-inicio.webp"
              alt="Panel de Operon Reservas mostrando la ocupación del día, los pagos del mes y la agenda de llegadas y salidas"
              priority
            />
          </motion.div>
        </div>
        {/* Degradado que funde la captura con la marquesina de abajo. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{ background: "linear-gradient(to bottom, rgba(251,249,244,0), #FBF9F4 82%)" }}
          aria-hidden
        />
      </div>

      <MarquesinaReemplaza />
    </section>
  );
}

function TarjetaReservaEntrante() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="relative lg:pt-10"
    >
      <div className="float rounded-2xl border border-line bg-paper/90 p-6 shadow-[0_18px_60px_-24px_rgba(20,19,15,0.25)] backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-blue" />
          <span className="font-mono-up text-mute">Reserva nueva · web propia</span>
        </div>

        <p className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-tight text-ink">
          Martina Roldán
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[.12em] text-soft">
          Cabaña del Bosque · AC-4821
        </p>

        <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-[13.5px]">
          {[
            ["Estadía", "12 → 16 sept · 4 noches"],
            ["Total", "$ 592.000"],
            ["Seña acreditada", "$ 296.000"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4">
              <span className="text-mute">{k}</span>
              <span className="font-medium text-ink">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-blue-deep">
            Mail enviado
          </span>
          <span className="rounded-full bg-sol/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-ink/70">
            Noches bloqueadas
          </span>
        </div>
      </div>

      <TiraCalendario />

      <p className="mt-5 max-w-[38ch] pl-1 text-[13.5px] leading-[1.5] text-mute">
        Todo esto pasó sin que tocaras el teléfono: el huésped reservó en tu web, pagó la seña y las
        cuatro noches quedaron bloqueadas para el resto del mundo.
      </p>
    </motion.div>
  );
}

/**
 * Doce días de septiembre; las cuatro noches de la reserva de arriba se pintan
 * una tras otra. Es la consecuencia de la tarjeta, dibujada.
 */
function TiraCalendario() {
  const dias = Array.from({ length: 12 }, (_, i) => 8 + i);
  const tomadas = [12, 13, 14, 15];

  return (
    <div className="mt-6 rounded-2xl border border-line bg-paper/70 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono-up text-soft">Cabaña del Bosque · sept</span>
        <span className="font-mono-up text-blue">4 noches</span>
      </div>
      <div className="mt-3 flex gap-1">
        {dias.map((d, i) => {
          const ocupada = tomadas.includes(d);
          return (
            <motion.span
              key={d}
              initial={{ backgroundColor: "rgba(225,219,204,0)" }}
              animate={{ backgroundColor: ocupada ? "#1F40C2" : "rgba(225,219,204,0.55)" }}
              transition={{ duration: 0.35, delay: 1.1 + (ocupada ? tomadas.indexOf(d) * 0.12 : i * 0.02) }}
              className="flex h-7 flex-1 items-center justify-center rounded-[5px] font-mono text-[10px]"
              style={{ color: ocupada ? "#FBF9F4" : "#A39C90" }}
            >
              {d}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function MarquesinaReemplaza() {
  return (
    <div className="relative border-y border-line/70 bg-paper/60 backdrop-blur-sm">
      <div className="overflow-hidden">
        <div className="marquee-track flex gap-12 whitespace-nowrap py-5 font-mono-up text-mute">
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0 gap-12">
              <span className="flex items-center gap-3 text-ink/70">Reemplaza</span>
              {reemplaza.map((t) => (
                <span key={t} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-sol" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
