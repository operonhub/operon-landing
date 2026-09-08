"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { COMISION_OTA, comparacion } from "./datos";

const MIN = 300000;
const MAX = 12000000;
const PASO = 100000;

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/**
 * Escenarios de recupero.
 *
 * A propósito NO se afirma qué porcentaje de las reservas de OTA "se puede"
 * pasar a directas: depende del alojamiento y sería un número inventado.
 * Se muestra la sensibilidad y que el visitante saque su propia cuenta.
 */
const ESCENARIOS = [
  { pct: 0.25, etiqueta: "Si pasás 1 de cada 4" },
  { pct: 0.5, etiqueta: "Si pasás la mitad" },
  { pct: 1, etiqueta: "Si pasás todas" },
];

const tonos = {
  bien: "text-ink",
  medio: "text-mute",
  mal: "text-mute/70",
};

export default function Comparacion() {
  const [mensual, setMensual] = useState(2000000);

  const { comisionMes, comisionAnio } = useMemo(
    () => ({
      comisionMes: mensual * COMISION_OTA,
      comisionAnio: mensual * COMISION_OTA * 12,
    }),
    [mensual]
  );

  return (
    <section id="comparacion" className="relative border-t border-line/70 py-24 lg:py-32">
      <div className="shell">
        <header className="max-w-[52ch]">
          <div className="font-mono-up mb-4 text-blue">§ La cuenta</div>
          <h2
            className="font-display font-semibold leading-[0.98] tracking-tightest"
            style={{ fontSize: "clamp(34px, 5vw, 62px)" }}
          >
            Booking te trae huéspedes.
            <br />
            <span className="font-medium italic text-mute">Y se lleva el 15%.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.6] text-mute">
            No te decimos que las dejes: las OTA sirven para que te encuentre el que no te conoce. El
            punto es el otro — el que ya se fue contento y vuelve el año que viene no tendría que
            costarte comisión.
          </p>
        </header>

        {/* Calculadora */}
        <div className="mt-14 grid gap-10 rounded-2xl border border-line bg-cream/50 p-6 sm:p-9 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <label
              htmlFor="facturacion-ota"
              className="font-mono-up block text-mute"
            >
              Facturación mensual que hoy entra por OTA
            </label>

            <p className="mt-4 font-display text-[38px] font-semibold leading-none tracking-tightest text-ink sm:text-[46px]">
              {pesos.format(mensual)}
            </p>

            <input
              id="facturacion-ota"
              type="range"
              min={MIN}
              max={MAX}
              step={PASO}
              value={mensual}
              onChange={(e) => setMensual(Number(e.target.value))}
              className="deslizador mt-7 w-full"
              aria-describedby="facturacion-ayuda"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[.12em] text-soft">
              <span>{pesos.format(MIN)}</span>
              <span>{pesos.format(MAX)}</span>
            </div>

            <p id="facturacion-ayuda" className="mt-6 text-[13.5px] leading-[1.55] text-mute">
              Movelo hasta tu número real. La comisión se calcula al {Math.round(COMISION_OTA * 100)} %,
              que es la media que reportan los alojamientos argentinos.
            </p>
          </div>

          <div className="lg:border-l lg:border-line lg:pl-14">
            <p className="font-mono-up text-mute">Lo que se va en comisión</p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <motion.span
                key={comisionAnio}
                initial={{ opacity: 0.4, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-display text-[44px] font-semibold leading-none tracking-tightest text-blue sm:text-[58px]"
              >
                {pesos.format(comisionAnio)}
              </motion.span>
              <span className="text-[14px] text-mute">por año</span>
            </div>
            <p className="mt-2 text-[13.5px] text-mute">
              {pesos.format(comisionMes)} por mes, todos los meses.
            </p>

            <div className="mt-8 space-y-px overflow-hidden rounded-xl border border-line bg-paper">
              {ESCENARIOS.map((e) => (
                <div
                  key={e.pct}
                  className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3.5 last:border-b-0"
                >
                  <span className="text-[13.5px] text-mute">{e.etiqueta} a tu web</span>
                  <span className="font-mono text-[13.5px] font-medium text-ink">
                    +{pesos.format(comisionAnio * e.pct)}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[12.5px] leading-[1.55] text-soft">
              Plata que hoy no ves. Operon Reservas tiene un costo fijo mensual —
              te lo pasamos cerrado, pero nunca es un porcentaje de lo que reservás.
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-16 lg:mt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-[22px] font-semibold tracking-tight text-ink lg:text-[28px]">
              Las tres formas de administrar una cabaña
            </h3>
            <span className="font-mono-up text-soft md:hidden">Deslizá la tabla →</span>
          </div>

          <div className="no-scrollbar mt-7 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Comparación entre Operon Reservas, las plataformas tipo Booking o Airbnb, y
                administrar con planilla y WhatsApp
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[30%] pb-5 pr-6 align-bottom">
                    <span className="font-mono-up text-soft">Criterio</span>
                  </th>
                  {comparacion.columnas.map((c) => (
                    <th
                      key={c.id}
                      scope="col"
                      className="pb-5 pr-6 align-bottom"
                    >
                      <span
                        className={`block font-display text-[16px] font-semibold tracking-tight ${
                          c.destacada ? "text-blue" : "text-ink"
                        }`}
                      >
                        {c.titulo}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[.12em] text-soft">
                        {c.sub}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparacion.filas.map((f) => (
                  <tr key={f.criterio} className="border-t border-line align-top">
                    <th scope="row" className="py-4 pr-6 text-[14px] font-normal leading-[1.45] text-ink">
                      {f.criterio}
                    </th>
                    <td className="py-4 pr-6">
                      <span className="inline-flex items-baseline gap-2 text-[14px] font-medium text-ink">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 self-start rounded-full bg-blue" aria-hidden />
                        {f.operon.v}
                      </span>
                    </td>
                    <td className={`py-4 pr-6 text-[14px] leading-[1.45] ${tonos[f.ota.tono]}`}>
                      {f.ota.v}
                    </td>
                    <td className={`py-4 text-[14px] leading-[1.45] ${tonos[f.planilla.tono]}`}>
                      {f.planilla.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[74ch] text-[12.5px] leading-[1.6] text-soft">
            La comisión de Booking.com para alojamientos va, según país, tipo de propiedad y
            acuerdos de visibilidad, de 10 % a 20 %; 15 % es la media y lo que reportan los
            propietarios de cabañas en Argentina. Airbnb cobra al anfitrión ~3 % con cargo al
            huésped aparte, o alrededor del 15 % en el esquema de comisión unificada.
          </p>
        </div>
      </div>
    </section>
  );
}
