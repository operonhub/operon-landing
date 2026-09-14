"use client";
import { Fragment, useRef } from "react";
import { MotionConfig, motion, useInView } from "framer-motion";

const diferenciales = [
  {
    k: "01",
    t: "El código es tuyo desde el día uno.",
    d: "El repositorio, la infraestructura, los accesos y las claves quedan a nombre de tu empresa. Operon es opcional para mantenerlo, nunca una condición para que siga andando.",
    Escena: EscenaPropiedad,
  },
  {
    k: "02",
    t: "Stack estándar: cualquier dev lo continúa.",
    d: "Next.js, Node, Postgres y Supabase: herramientas que conoce cualquier desarrollador competente. Si mañana seguís con otro equipo, no arranca de cero.",
    Escena: EscenaStack,
  },
  {
    k: "03",
    t: "Precio fijo. Si nos pasamos, lo absorbemos.",
    d: "Cotizamos por entregable y cerramos el número antes de empezar. Si el trabajo lleva más horas de las que estimamos, la diferencia corre por nuestra cuenta, no por la tuya.",
    Escena: EscenaPrecio,
  },
  {
    k: "04",
    t: "Ves el avance todas las semanas.",
    d: "Sprints de una a dos semanas, demo en vivo cada viernes y una versión de prueba abierta desde el día uno. El primer demo funcional llega entre la primera y la segunda semana.",
    Escena: EscenaSemanas,
  },
];

const SALIDA = [0.2, 0.7, 0.3, 1];

export default function Differential() {
  return (
    <section id="diferencial" className="relative border-t border-line/70 bg-cream/40 py-28 lg:py-36">
      <div className="shell">
        <div className="mb-14 grid items-start gap-10 lg:mb-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <div className="font-mono-up mb-4 text-blue">§ Por qué Operon</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Cero vendor-lock.
              <br />
              <span className="font-medium italic text-mute">El resto, te lo mostramos.</span>
            </h2>
          </div>
          <p className="max-w-[54ch] text-[17px] leading-[1.55] text-mute lg:pt-3">
            Lo que más se teme al contratar software es quedar atado a un proveedor, pagar de más y no
            saber en qué está el proyecto. Estas son las cuatro reglas que lo evitan:
          </p>
        </div>

        {/* Con menos movimiento pedido, framer saltea los desplazamientos de
            las escenas y deja solo los fundidos. */}
        <MotionConfig reducedMotion="user">
          <ol className="border-t border-line">
            {diferenciales.map((item) => (
              <Fila key={item.k} {...item} />
            ))}
          </ol>
        </MotionConfig>
      </div>
    </section>
  );
}

function Fila({ k, t, d, Escena }) {
  const escenaRef = useRef(null);
  // Se observa la escena y no la fila: en mobile la fila entera puede ser más
  // alta que la pantalla y nunca verse en la proporción pedida.
  const activa = useInView(escenaRef, { once: true, amount: 0.5 });

  return (
    <li className="grid gap-8 border-b border-line py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-16">
      <div>
        <div className="font-mono-up flex items-center gap-2 text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          {k}
        </div>
        <h3 className="mt-5 font-display text-[28px] font-semibold leading-[1.05] tracking-tight lg:text-[36px]">
          {t}
        </h3>
        <p className="mt-4 max-w-[46ch] text-[15.5px] leading-[1.6] text-mute">{d}</p>
      </div>

      <div ref={escenaRef} className="w-full lg:max-w-[600px] lg:justify-self-end">
        <Escena activa={activa} />
      </div>
    </li>
  );
}

/*
 * Las escenas son ilustraciones de la frase de al lado (aria-hidden: el texto
 * ya dice lo mismo). Ninguna arranca invisible: si el observer no llega a
 * dispararse por un scroll muy rápido, se ve el estado "antes", no un hueco.
 */

const ACTIVOS = ["Código fuente", "Base de datos", "Hosting y dominio", "Claves y accesos"];

function EscenaPropiedad({ activa }) {
  return (
    <div
      aria-hidden
      className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-42px_rgba(20,19,15,.4)] sm:p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sand" />
          <span className="h-2 w-2 rounded-full bg-sand" />
          <span className="h-2 w-2 rounded-full bg-sand" />
        </div>
        <span className="font-mono-up text-mute">Repositorio</span>
      </div>

      <p className="font-mono-up mt-6 text-mute">Propietario</p>
      <p className="mt-2 font-mono text-[16px] text-ink sm:text-[19px]">
        {/* Los dos dueños ocupan la misma celda: el cambio no mueve la línea. */}
        <span className="inline-grid align-bottom">
          <motion.span
            className="[grid-area:1/1]"
            initial={false}
            animate={activa ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            operonhub
          </motion.span>
          <motion.span
            className="text-blue [grid-area:1/1]"
            initial={false}
            animate={activa ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            tu-empresa
          </motion.span>
        </span>
        <span className="text-mute">/</span>sistema
      </p>

      <ul className="mt-6 border-t border-line">
        {ACTIVOS.map((activo, i) => (
          <li
            key={activo}
            className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0 last:pb-0"
          >
            <span className="flex items-center gap-3 text-[14.5px] text-ink">
              <Tilde activa={activa} delay={0.75 + i * 0.14} />
              {activo}
            </span>
            <motion.span
              className="font-mono-up whitespace-nowrap text-blue"
              initial={false}
              animate={{ opacity: activa ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.14 }}
            >
              A tu nombre
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CAPAS = [
  { capa: "Lo que ves en pantalla", herramienta: "Next.js" },
  { capa: "La lógica del negocio", herramienta: "Node" },
  { capa: "Los datos", herramienta: "Postgres" },
  { capa: "Usuarios y accesos", herramienta: "Supabase" },
];

function EscenaStack({ activa }) {
  return (
    <div aria-hidden>
      <div className="space-y-2.5">
        {CAPAS.map((c, i) => (
          // Cada capa arranca corrida y encastra en su lugar, escalonada.
          <motion.div
            key={c.herramienta}
            initial={false}
            animate={activa ? { opacity: 1, x: 0 } : { opacity: 0.45, x: i % 2 ? 22 : -22 }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.13, ease: SALIDA }}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-4 py-4 sm:px-5"
            style={{ marginLeft: `${i * 3}%`, marginRight: `${(CAPAS.length - 1 - i) * 3}%` }}
          >
            <span className="text-[14.5px] text-ink">{c.capa}</span>
            <span className="font-mono-up text-blue">{c.herramienta}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={false}
        animate={{ opacity: activa ? 1 : 0.45 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="font-mono-up mt-5 flex items-center gap-3 text-mute"
      >
        <span className="h-px w-6 bg-line" />
        Documentado para el que venga después
      </motion.p>
    </div>
  );
}

function EscenaPrecio({ activa }) {
  return (
    <div
      aria-hidden
      className="rounded-2xl border border-line bg-paper px-5 py-6 shadow-[0_24px_60px_-42px_rgba(20,19,15,.4)] sm:px-8 sm:py-8"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono-up text-mute">Presupuesto</span>
        <span className="font-mono-up flex items-center gap-1.5 text-ink">
          <Candado />
          Precio cerrado
        </span>
      </div>

      <ul className="mt-5 space-y-3.5 border-y border-dashed border-line py-5 text-[14.5px]">
        {["Diagnóstico y plan", "Construcción", "Implementación"].map((linea) => (
          <li key={linea} className="flex items-baseline justify-between gap-4">
            <span className="text-ink">{linea}</span>
            <span className="font-mono-up text-mute">Incluido</span>
          </li>
        ))}
        <motion.li
          className="flex items-baseline justify-between gap-4"
          initial={false}
          animate={{ opacity: activa ? 1 : 0.45 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="text-ink">Horas que no estaban previstas</span>
          {/* Lo que se iba a cobrar se tacha y en el mismo lugar aparece
              quién lo paga. */}
          <span className="inline-grid shrink-0 justify-items-end">
            <motion.span
              className="font-mono-up relative text-mute [grid-area:1/1]"
              initial={false}
              animate={{ opacity: activa ? 0 : 1 }}
              transition={{ duration: 0.3, delay: 1.35 }}
            >
              + A cobrar
              <motion.span
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-ink"
                initial={false}
                animate={{ scaleX: activa ? 1 : 0 }}
                transition={{ duration: 0.35, delay: 0.85 }}
              />
            </motion.span>
            <motion.span
              className="font-mono-up text-blue [grid-area:1/1]"
              initial={false}
              animate={{ opacity: activa ? 1 : 0 }}
              transition={{ duration: 0.35, delay: 1.5 }}
            >
              A cargo de Operon
            </motion.span>
          </span>
        </motion.li>
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="font-display text-[17px] font-semibold tracking-tight text-ink">Total a pagar</span>
        <motion.span
          className="font-mono-up rounded-md px-2 py-1 text-ink"
          initial={false}
          animate={{
            backgroundColor: activa
              ? ["rgba(227,231,248,0)", "rgba(227,231,248,1)", "rgba(227,231,248,0)"]
              : "rgba(227,231,248,0)",
          }}
          transition={{ duration: 1.2, delay: 1.7 }}
        >
          Sin cambios
        </motion.span>
      </div>
    </div>
  );
}

const DIAS = ["L", "M", "M", "J", "V"];
const SEMANAS = 4;

function EscenaSemanas({ activa }) {
  return (
    <div aria-hidden className="rounded-2xl border border-line bg-paper p-5 sm:p-7">
      {/* El tiempo corre hacia la derecha, igual que el riel del proceso:
          cada columna es una semana y el viernes es el día de demo. */}
      <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] gap-x-2 gap-y-1.5 sm:gap-x-3">
        <span />
        {Array.from({ length: SEMANAS }, (_, s) => (
          <span key={s} className="font-mono-up pb-2 text-center text-mute">
            Sem {s + 1}
          </span>
        ))}

        {DIAS.map((dia, d) => (
          <Fragment key={d}>
            <span className="font-mono-up flex items-center pr-2 text-mute">{dia}</span>
            {Array.from({ length: SEMANAS }, (_, s) =>
              d === DIAS.length - 1 ? (
                <motion.span
                  key={s}
                  initial={false}
                  animate={activa ? { opacity: 1, scale: 1 } : { opacity: 0.35, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: 0.5 + s * 0.28, ease: SALIDA }}
                  className="font-mono-up flex h-7 items-center justify-center rounded-md bg-blue text-paper"
                >
                  Demo
                </motion.span>
              ) : (
                <span key={s} className="h-7 rounded-md bg-cream" />
              )
            )}
          </Fragment>
        ))}

        <span />
        <motion.div
          className="col-span-2 mt-1"
          initial={false}
          animate={{ opacity: activa ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 1.15 }}
        >
          <div className="h-2 rounded-b-md border-x border-b border-blue/50" />
          <p className="font-mono-up mt-1.5 text-center text-blue">Primer demo</p>
        </motion.div>
        <span className="col-span-2" />

        <span />
        <div className="col-span-4 mt-4">
          <div className="relative h-2 overflow-hidden rounded-full bg-cream">
            <motion.div
              className="absolute inset-0 origin-left rounded-full bg-ink"
              initial={false}
              animate={{ scaleX: activa ? 1 : 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: SALIDA }}
            />
          </div>
          <p className="font-mono-up mt-2 text-mute">Versión de prueba abierta</p>
        </div>
      </div>
    </div>
  );
}

function Tilde({ activa, delay }) {
  return (
    <span className="relative h-5 w-5 shrink-0 rounded-full border border-line bg-paper">
      <motion.span
        className="absolute inset-[-1px] flex items-center justify-center rounded-full bg-blue"
        initial={false}
        animate={{ opacity: activa ? 1 : 0, scale: activa ? 1 : 0.5 }}
        transition={{ duration: 0.35, delay, ease: SALIDA }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="#FBF9F4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 5.2 4.1 7.2 8 3" />
        </svg>
      </motion.span>
    </span>
  );
}

function Candado() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1" y="5" width="9" height="6.2" rx="1.4" />
      <path d="M3 5V3.6a2.5 2.5 0 0 1 5 0V5" />
    </svg>
  );
}
