"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/*
 * Pasos del ciclo:
 * 0 · calendario vacío
 * 1 · entra la reserva de Martina y pinta sus cuatro noches
 * 2 · entra el segundo pedido y se ven las noches que se pisan
 * 3 · el segundo pedido no se guarda
 */
const DURACION = [1200, 1600, 1600, 3200];

/** Septiembre, del 10 al 19. El día D vive en la columna (D - 9). */
const DIAS = Array.from({ length: 10 }, (_, i) => 10 + i);
const columna = (dia) => dia - 9;

const MARTINA = { desde: 12, hasta: 16 }; // noches 12, 13, 14 y 15
const SEGUNDO = { desde: 14, hasta: 18 }; // noches 14, 15, 16 y 17
const CHOQUE = [14, 15];

const AZUL = "#3355E0";
const ROJO = "#8E2F36";

export default function SinSobreventa() {
  const ref = useRef(null);
  const enPantalla = useInView(ref, { amount: 0.35 });
  const [paso, setPaso] = useState(0);

  // El ciclo sólo corre mientras la sección se ve: fuera de pantalla no aporta
  // nada y mantendría un timer vivo por todo el scroll.
  useEffect(() => {
    if (!enPantalla) return;
    const t = setTimeout(() => setPaso((p) => (p + 1) % 4), DURACION[paso]);
    return () => clearTimeout(t);
  }, [enPantalla, paso]);

  return (
    <section
      id="sobreventa"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32"
    >
      <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(760px 420px at 78% 12%, rgba(31,64,194,.26), transparent 62%), radial-gradient(620px 360px at 8% 96%, rgba(242,201,76,.09), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <div className="font-mono-up mb-5 text-sol">§ La garantía</div>
          <h2
            className="font-display font-semibold leading-[0.96] tracking-tightest"
            style={{ fontSize: "clamp(34px, 5.2vw, 68px)" }}
          >
            No podés vender
            <br />
            dos veces{" "}
            <span className="font-medium italic text-paper/60">la misma noche.</span>
          </h2>

          <p className="mt-7 max-w-[50ch] text-[16.5px] leading-[1.6] text-paper/75">
            Es el error que más caro sale: dos familias con la misma cabaña reservada para el mismo
            fin de semana largo, y a una de las dos le tenés que decir que no un viernes a la noche.
          </p>

          <p className="mt-5 max-w-[50ch] text-[16.5px] leading-[1.6] text-paper/75">
            Con Operon Reservas eso{" "}
            <strong className="font-medium text-paper">no puede pasar</strong>. Y no porque la
            pantalla lo revise antes de guardar — ese tipo de control se saltea solo cuando dos
            personas reservan al mismo tiempo. Es el sistema el que no acepta guardar dos estadías
            que compartan aunque sea una noche en la misma cabaña.
          </p>

          <p className="mt-5 max-w-[50ch] text-[16.5px] leading-[1.6] text-paper/75">
            El que llegó segundo ve que esas fechas ya no están y elige otras. Vos ni te enterás,
            porque no hay nada que arreglar.
          </p>

          {/* El detalle técnico es el respaldo de la promesa, pero va guardado:
              al dueño de la cabaña la línea de SQL no le dice nada y leerla
              primero le tapa el mensaje. */}
          <details className="group mt-9 max-w-[52ch] rounded-xl border border-paper/12 bg-paper/[0.03] px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13.5px] font-medium text-paper/70 transition-colors hover:text-paper">
              Cómo está hecho, para el que quiera saber
              <span
                className="shrink-0 text-[18px] leading-none text-paper/40 transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="mt-4 text-[13.5px] leading-[1.6] text-paper/55">
              La prohibición vive en la base de datos, no en la aplicación. Es una restricción de
              exclusión de Postgres sobre la tabla que guarda la ocupación de cada unidad: la base
              compara las fechas de la estadía nueva contra las que ya están y rechaza la operación
              si se tocan. Como las reservas y los bloqueos manuales viven en esa misma tabla,
              tampoco se puede bloquear por mantenimiento una noche ya vendida.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-paper/10 bg-ink/60 p-4 font-mono text-[11px] leading-[1.7] text-paper/70">
              <code>{`constraint occupancy_no_overlap
  exclude using gist (
    unit_id with =,   -- misma unidad
    during  with &&   -- fechas que se tocan
  );`}</code>
            </pre>
          </details>
        </div>

        {/* La escena, contada en el calendario y sin una palabra técnica. */}
        <Calendario paso={paso} />
      </div>
    </section>
  );
}

function Calendario({ paso }) {
  const verMartina = paso >= 1;
  const verSegundo = paso >= 2;
  const rechazado = paso >= 3;

  return (
    <div className="rounded-2xl border border-paper/12 bg-paper/[0.04] p-5 backdrop-blur sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-[17px] font-semibold tracking-tight text-paper">
          Cabaña del Bosque
        </p>
        <p className="font-mono-up text-paper/40">Septiembre</p>
      </div>

      {/* Los días. Los que se pisan se marcan en rojo. */}
      <div className="mt-6 grid grid-cols-10 gap-1">
        {DIAS.map((d) => {
          const enConflicto = verSegundo && CHOQUE.includes(d);
          return (
            <motion.div
              key={d}
              animate={{
                backgroundColor: enConflicto ? "rgba(142,47,54,0.55)" : "rgba(251,249,244,0.05)",
                color: enConflicto ? "#FFD9DC" : "rgba(251,249,244,0.5)",
              }}
              transition={{ duration: 0.35 }}
              className="flex h-8 items-center justify-center rounded-md font-mono text-[11px]"
            >
              {d}
            </motion.div>
          );
        })}
      </div>

      {/* La reserva que sí entra. */}
      <div className="mt-3 grid grid-cols-10 gap-1">
        <div
          className="h-11 rounded-lg bg-paper/[0.035]"
          style={{ gridColumn: "1 / -1", gridRow: 1 }}
          aria-hidden
        />
        <motion.div
          initial={false}
          animate={{ opacity: verMartina ? 1 : 0, y: verMartina ? 0 : -6 }}
          transition={{ duration: 0.45 }}
          className="flex h-11 items-center overflow-hidden rounded-lg px-2 sm:px-3"
          style={{
            gridColumn: `${columna(MARTINA.desde)} / span ${MARTINA.hasta - MARTINA.desde}`,
            gridRow: 1,
            background: AZUL,
          }}
        >
          <span className="truncate text-[12.5px] font-medium text-paper">Martina · 4 noches</span>
        </motion.div>
      </div>

      {/* El pedido que se pisa con el anterior. */}
      <div className="mt-2 grid grid-cols-10 gap-1">
        <div
          className="h-11 rounded-lg bg-paper/[0.035]"
          style={{ gridColumn: "1 / -1", gridRow: 1 }}
          aria-hidden
        />
        <motion.div
          initial={false}
          animate={{
            opacity: verSegundo ? (rechazado ? 0.5 : 1) : 0,
            y: verSegundo ? 0 : -6,
            backgroundColor: rechazado ? ROJO : "rgba(251,249,244,0.14)",
          }}
          transition={{ duration: 0.45 }}
          className="flex h-11 items-center overflow-hidden rounded-lg px-2 sm:px-3"
          style={{
            gridColumn: `${columna(SEGUNDO.desde)} / span ${SEGUNDO.hasta - SEGUNDO.desde}`,
            gridRow: 1,
          }}
        >
          <span
            className={`truncate text-[12.5px] font-medium text-paper ${
              rechazado ? "line-through decoration-paper/70" : ""
            }`}
          >
            Otro pedido · 4 noches
          </span>
        </motion.div>
      </div>

      {/* El cartel, en el mismo castellano que usaría el huésped. */}
      <div className="mt-6 min-h-[92px] border-t border-paper/10 pt-5" aria-live="polite">
        {rechazado ? (
          <>
            <p className="text-[14.5px] font-medium text-[#FF9EA6]">
              El segundo pedido no se guarda.
            </p>
            <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-[1.55] text-paper/55">
              Las noches del 14 y del 15 ya son de Martina. El sistema no las puede vender otra vez,
              ni aunque los dos aprieten «Reservar» en el mismo segundo.
            </p>
          </>
        ) : (
          <>
            <p className="text-[14.5px] font-medium text-paper/70">
              {verSegundo
                ? "Dos pedidos quieren las noches del 14 y del 15."
                : verMartina
                  ? "Martina reservó del 12 al 16."
                  : "Una cabaña, diez días de septiembre."}
            </p>
            <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-[1.55] text-paper/40">
              {verSegundo
                ? "Los dos entraron casi al mismo tiempo: uno por tu web y otro cargado a mano."
                : verMartina
                  ? "Esas cuatro noches quedan tomadas para todo el mundo."
                  : "Mirá qué pasa cuando dos personas piden las mismas fechas."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
