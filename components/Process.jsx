"use client";
import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Diagnóstico", d: "Una llamada de 45 min. Mapeamos tu proceso real — no el que está en el ppt — y detectamos dónde duele." },
  { n: "02", t: "Diseño", d: "Te entregamos un plan corto: qué se automatiza, qué se construye, qué se deja como está. Con tiempos y precio fijo." },
  { n: "03", t: "Construcción", d: "Sprints de 1–2 semanas. Demo en vivo cada viernes. Todo en un staging propio para que lo toques desde día uno." },
  { n: "04", t: "Implementación", d: "Migración asistida, entrenamiento al equipo y documentación que se entiende. Sin cliffs de soporte." },
  { n: "05", t: "Optimización", d: "Mensual o por necesidad. Lo que construimos es tuyo: código, infra, accesos. Operon es opcional, no condición." },
];

export default function Process() {
  return (
    <section id="proceso" className="relative py-28 lg:py-36 border-t border-line/70">
      <div className="shell">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-20 items-end mb-16">
          <div>
            <div className="font-mono-up text-blue mb-4">§ Cómo trabajamos</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Cinco pasos.<br />
              <span className="italic font-medium text-mute">Sin sorpresas.</span>
            </h2>
          </div>
          <p className="text-[17px] leading-[1.55] text-mute max-w-[54ch]">
            El mismo método para una landing o un SaaS multi-tenant. Cambia el alcance, no la lógica.
            Vos sabés en qué semana estamos y qué viene después.
          </p>
        </div>

        <ol className="relative grid lg:grid-cols-5 border-t border-b border-line">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative p-8 lg:py-12 lg:px-7 ${i !== steps.length - 1 ? "lg:border-r border-b lg:border-b-0 border-line" : ""}`}
            >
              <div className="flex items-center gap-3 font-mono-up text-mute">
                <span className="w-4 h-px bg-blue inline-block" />
                {s.n}
              </div>
              <h3 className="mt-5 font-display font-semibold text-[24px] lg:text-[26px] leading-[1.05] tracking-tight">
                {s.t}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-mute max-w-[32ch]">{s.d}</p>

              {/* tiny diagram */}
              <div className="mt-8 flex items-center gap-1 h-10">
                {Array.from({ length: 7 }).map((_, k) => (
                  <span
                    key={k}
                    className="w-1 rounded-full"
                    style={{
                      height: `${20 + ((k + i) % 5) * 14}%`,
                      background: k === i ? "#1F40C2" : "rgba(20,19,15,0.18)",
                    }}
                  />
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
