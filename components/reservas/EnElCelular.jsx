"use client";
import { motion } from "framer-motion";
import { MarcoTelefono } from "./Marcos";

const puntos = [
  {
    k: "Cada alojamiento, aislado",
    d: "Tus reservas, tus huéspedes y tus precios viven en una organización propia, separada por seguridad a nivel de fila en Postgres. Nadie de afuera lee una fila tuya.",
  },
  {
    k: "Calendario iCal por unidad",
    d: "Cada cabaña publica su feed para que Airbnb o Booking lean tus fechas ocupadas y dejen de ofrecerlas.",
  },
  {
    k: "Sin instalar nada",
    d: "Es una web. Entrás desde el celular, la tablet o la compu de recepción con el mismo usuario, y siempre ves lo mismo.",
  },
];

export default function EnElCelular() {
  return (
    <section className="relative overflow-hidden border-t border-line/70 bg-cream/40 py-24 lg:py-32">
      <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-[260px] lg:max-w-[300px]"
        >
          <MarcoTelefono
            src="/reservas/movil-inicio.webp"
            alt="Operon Reservas en el celular: ocupación del día, pendientes, check-ins y cobrado del mes"
          />
        </motion.div>

        <div>
          <div className="font-mono-up mb-4 text-blue">§ Donde estés</div>
          <h2
            className="font-display font-semibold leading-[0.98] tracking-tightest"
            style={{ fontSize: "clamp(32px, 4.6vw, 56px)" }}
          >
            El panel entra
            <br />
            <span className="font-medium italic text-mute">en el bolsillo.</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-[16px] leading-[1.6] text-mute">
            Estás cortando el pasto y suena el teléfono preguntando por el finde largo. Abrís, mirás
            el calendario, cargás la reserva y volvés al pasto.
          </p>

          <dl className="mt-10 space-y-7 border-t border-line pt-8">
            {puntos.map((p, i) => (
              <motion.div
                key={p.k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <dt className="font-display text-[16.5px] font-semibold tracking-tight text-ink">
                  {p.k}
                </dt>
                <dd className="mt-1.5 max-w-[54ch] text-[13.5px] leading-[1.6] text-mute">{p.d}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
