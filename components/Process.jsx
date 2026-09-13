"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const steps = [
  {
    n: "01",
    t: "Diagnóstico",
    d: "Mapeamos tu proceso real — no el que está en el ppt — y detectamos dónde duele.",
    entregable: "El mapa de tu proceso",
    plazo: "Una llamada de 45 min",
  },
  {
    n: "02",
    t: "Diseño",
    d: "Qué se automatiza, qué se construye y qué se deja como está. Sin letra chica.",
    entregable: "Un plan corto, con tiempos y precio fijo",
  },
  {
    n: "03",
    t: "Construcción",
    d: "Sprints de 1–2 semanas y demo en vivo cada viernes. Lo vas probando mientras se construye.",
    entregable: "Una versión de prueba propia, abierta desde el día uno",
    plazo: "Primer demo funcional: semana 1–2",
  },
  {
    n: "04",
    t: "Implementación",
    d: "Migración asistida y acompañamiento hasta que tu equipo lo usa solo. No te soltamos el día del lanzamiento.",
    entregable: "Equipo entrenado y documentación que se entiende",
  },
  {
    n: "05",
    t: "Optimización",
    d: "Seguimos mejorando lo que ya funciona. Operon es opcional, no condición.",
    entregable: "Código, infra y accesos a tu nombre",
    plazo: "Mensual o por necesidad",
  },
];

const TOTAL = steps.length;

// `lg` más un alto mínimo: en una pantalla más baja el riel y los paneles no
// entran enteros mientras la sección está fijada, y funciona mejor la lista.
const CONSULTA_FIJADO = "(min-width: 1024px) and (min-height: 600px)";
const CONSULTA_MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

// El riel termina de llenarse al 85% del recorrido: el tramo que queda muestra
// el proyecto completo antes de que la sección se suelte.
const FIN_DEL_RIEL = 0.85;

/**
 * En qué estado está un paso según cuánto avanzó el riel.
 *
 * `avance` va de 0 (riel vacío) a 1 (riel lleno). El nodo de cada paso está en
 * `indice / (total - 1)` del riel: 0, 0.25, 0.5, 0.75 y 1 con cinco pasos.
 *
 * @param {number} avance
 * @param {number} indice
 * @param {number} total
 * @returns {"pendiente" | "en-curso" | "hecho"}
 */
function estadoDelPaso(avance, indice, total) {
  // TODO(Santiago): definir cuándo un paso está "en curso" y cuándo "hecho".
  // Provisorio: el paso se da por hecho apenas el riel toca su nodo, así que
  // nunca hay uno en curso.
  const posicion = indice / (total - 1);
  return avance >= posicion ? "hecho" : "pendiente";
}

export default function Process() {
  const menosMovimiento = useMedia(CONSULTA_MENOS_MOVIMIENTO);
  const fijado = useMedia(CONSULTA_FIJADO) && !menosMovimiento;

  // Fijado, el aire de abajo lo da el propio panel sticky (el contenido va
  // centrado en la pantalla), así que la sección no lleva padding inferior.
  return (
    <section
      id="proceso"
      className={`relative border-t border-line/70 pt-28 lg:pt-36 ${fijado ? "" : "pb-28 lg:pb-36"}`}
    >
      <div className="shell">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <div className="font-mono-up mb-4 text-blue">§ Cómo trabajamos</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Cinco pasos.
              <br />
              <span className="font-medium italic text-mute">Sin sorpresas.</span>
            </h2>
          </div>
          <p className="max-w-[54ch] text-[17px] leading-[1.55] text-mute">
            El mismo método para una landing o un SaaS multi-tenant. Cambia el alcance, no la lógica.
            Vos sabés en qué semana estamos y qué viene después.
          </p>
        </div>
      </div>

      {fijado ? <RielFijado /> : <RielVertical estatico={menosMovimiento} />}
    </section>
  );
}

/*
 * Desktop: la sección se fija y el scroll llena el riel hacia la derecha
 * mientras los paneles se corren. Con el track desplazado `avance × distancia`
 * y los nodos en `i / (total - 1)` del riel, cada nodo queda sobre su panel
 * justo cuando ese paso está activo.
 */
function RielFijado() {
  const recorridoRef = useRef(null);
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: recorridoRef,
    // 64px es el alto del Nav, que también es sticky: el pin arranca debajo.
    offset: ["start 64px", "end end"],
  });
  // La rueda del mouse avanza a saltos; el resorte los vuelve un movimiento
  // continuo sin que se note el retraso.
  const suave = useSpring(scrollYProgress, { stiffness: 170, damping: 32, restDelta: 0.0005 });
  const avance = useTransform(suave, [0, FIN_DEL_RIEL], [0, 1]);

  // Cuánto se tiene que correr el track para que el último panel termine en
  // el borde derecho del contenido. En px medidos: con el gap y los anchos en
  // calc(), un porcentaje deja el último paso cortado.
  const distancia = useMotionValue(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const medir = () => {
      const ultimo = track.lastElementChild;
      distancia.set(Math.max(0, ultimo.offsetLeft + ultimo.offsetWidth - track.clientWidth));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(track);
    return () => observador.disconnect();
  }, [distancia]);
  const x = useTransform([avance, distancia], ([a, d]) => -a * d);

  const estados = useEstados(avance);
  const actual = estados.reduce((ultimo, estado, i) => (estado === "pendiente" ? ultimo : i), 0);

  return (
    <div ref={recorridoRef} className="relative h-[260vh]">
      <div className="sticky top-16 flex h-[calc(100vh_-_4rem)] items-center overflow-hidden">
        <div className="shell w-full">
          <div className="flex items-baseline justify-between gap-6" aria-hidden>
            <span className="font-mono-up text-mute">Avance del proyecto</span>
            <span className="font-mono-up text-mute">
              <span className="text-ink">{steps[actual].n}</span> / {steps[TOTAL - 1].n}
            </span>
          </div>

          <div className="relative mt-7 h-[2px] rounded-full bg-line" aria-hidden>
            <motion.div
              className="absolute inset-0 origin-left rounded-full bg-blue"
              style={{ scaleX: avance }}
            />
            {steps.map((paso, i) => (
              <span
                key={paso.n}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(i / (TOTAL - 1)) * 100}%` }}
              >
                <Nodo estado={estados[i]} />
              </span>
            ))}
          </div>

          <motion.ol ref={trackRef} style={{ x }} className="relative mt-12 flex gap-6">
            {steps.map((paso, i) => (
              <li key={paso.n} className="w-[calc((100%_-_2.25rem)/2.5)] shrink-0">
                <Panel paso={paso} estado={estados[i]} />
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

/*
 * Mobile, tablet, pantallas bajas y menos movimiento: lista con el riel a la
 * izquierda, que se llena con el scroll sin retener nada.
 */
function RielVertical({ estatico }) {
  const listaRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: listaRef,
    // El riel se llena hasta el 65% de la pantalla: lo que ya pasó por la zona
    // de lectura queda completo, lo que viene abajo todavía no.
    offset: ["start 65%", "end 65%"],
  });

  // Los pasos no miden todos lo mismo, así que los nodos no caen parejos sobre
  // el riel. Se mide dónde cae cada uno para traducir el llenado al mismo
  // avance que usa el riel horizontal (nodo i en i / (total - 1)).
  const [nodos, setNodos] = useState(null);
  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const medir = () => {
      const caja = lista.getBoundingClientRect();
      if (!caja.height) return;
      setNodos(
        Array.from(lista.querySelectorAll("[data-nodo]"), (nodo) => {
          const r = nodo.getBoundingClientRect();
          return (r.top + r.height / 2 - caja.top) / caja.height;
        })
      );
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(lista);
    return () => observador.disconnect();
  }, []);

  const ideales = steps.map((_, i) => i / (TOTAL - 1));
  const reales = nodos ?? ideales;
  const avance = useTransform(scrollYProgress, reales, ideales);
  const relleno = useTransform(scrollYProgress, [reales[0], reales[TOTAL - 1]], [0, 1]);

  const estadosPorScroll = useEstados(avance);
  const estados = estatico ? steps.map(() => "hecho") : estadosPorScroll;

  return (
    <div className="shell">
      {/* En desktop esta lista solo aparece con pantallas bajas o menos
          movimiento: a todo el ancho los paneles quedaban de 1170px. */}
      <div ref={listaRef} className="relative mt-14 max-w-3xl lg:mt-20">
        {/* El riel va del primer nodo al último, no del borde de la lista. */}
        <div
          aria-hidden
          className="absolute left-[10px] w-[2px] -translate-x-1/2 rounded-full bg-line"
          style={{
            top: `${reales[0] * 100}%`,
            height: `${(reales[TOTAL - 1] - reales[0]) * 100}%`,
          }}
        >
          <motion.div
            className="absolute inset-0 origin-top rounded-full bg-blue"
            style={{ scaleY: estatico ? 1 : relleno }}
          />
        </div>

        <ol className="space-y-5">
          {steps.map((paso, i) => (
            <li key={paso.n} className="relative pl-10 sm:pl-14">
              <span data-nodo aria-hidden className="absolute left-0 top-[26px]">
                <Nodo estado={estados[i]} />
              </span>
              <Panel paso={paso} estado={estados[i]} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Estado de cada paso para un avance que cambia con el scroll. Solo vuelve a
// renderizar cuando algún paso cambia de estado, no en cada frame.
function useEstados(avance) {
  const calcular = (valor) => steps.map((_, i) => estadoDelPaso(valor, i, TOTAL));
  const [estados, setEstados] = useState(() => calcular(avance.get()));
  useMotionValueEvent(avance, "change", (valor) => {
    const siguientes = calcular(valor);
    setEstados((actuales) => (actuales.join() === siguientes.join() ? actuales : siguientes));
  });
  return estados;
}

// Arranca en false igual que el render del server y recién después del mount
// mira la pantalla real, como el carrusel de Projects. No se usa
// useReducedMotion() de framer: ya devuelve el valor real en el primer render
// del cliente, y el HTML deja de coincidir con el del server.
function useMedia(consulta) {
  const [coincide, setCoincide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const aplicar = () => setCoincide(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [consulta]);
  return coincide;
}

function Nodo({ estado }) {
  const hecho = estado === "hecho";
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-[background-color,border-color,transform] duration-300 ${
        hecho
          ? "border-blue bg-blue"
          : estado === "en-curso"
            ? "pulse-dot border-blue bg-paper"
            : "scale-[0.7] border-line bg-paper"
      }`}
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
        className={`transition-opacity duration-300 ${hecho ? "opacity-100" : "opacity-0"}`}
      >
        <path d="M2 5.2 4.1 7.2 8 3" />
      </svg>
    </span>
  );
}

const ETIQUETAS = { pendiente: "Pendiente", "en-curso": "En curso", hecho: "Hecho" };

function Panel({ paso, estado }) {
  return (
    <article
      className={`h-full rounded-2xl border p-7 transition-[border-color,background-color,box-shadow] duration-500 xl:p-8 ${
        estado === "en-curso"
          ? "border-blue/40 bg-paper shadow-[0_28px_60px_-34px_rgba(31,64,194,.45)]"
          : estado === "hecho"
            ? "border-line bg-paper"
            : "border-line/70 bg-cream/40"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono-up text-mute">{paso.n}</span>
        {/* El estado depende de hasta dónde scrolleó cada uno: para un lector
            de pantalla no es información del paso. */}
        <span
          aria-hidden
          className={`font-mono-up transition-colors duration-300 ${
            estado === "en-curso" ? "text-blue" : estado === "hecho" ? "text-ink" : "text-mute"
          }`}
        >
          {ETIQUETAS[estado]}
        </span>
      </div>

      <h3 className="mt-6 font-display text-[28px] font-semibold leading-[1.02] tracking-tight xl:text-[32px]">
        {paso.t}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.6] text-mute">{paso.d}</p>

      <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
        <div>
          <dt className="font-mono-up text-mute">Te llevás</dt>
          <dd className="mt-1.5 text-[14.5px] font-medium leading-[1.45] text-ink">{paso.entregable}</dd>
        </div>
        {paso.plazo && (
          <div>
            <dt className="font-mono-up text-mute">Cuándo</dt>
            <dd className="mt-1.5 text-[14.5px] font-medium leading-[1.45] text-ink">{paso.plazo}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
