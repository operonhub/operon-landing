"use client";
import { motion } from "framer-motion";

const projects = [
  {
    cat: "SaaS · Logística",
    title: "Cargo Atlas",
    desc: "Plataforma de seguimiento de cargas en tiempo real para una operadora de transporte regional. Reemplazó 4 planillas y un grupo de WhatsApp.",
    stack: ["Next.js", "Postgres", "Mapbox", "WhatsApp Cloud"],
    metric: "−63% tiempo de despacho",
  },
  {
    cat: "Automatización · Retail",
    title: "Flujo Onix",
    desc: "Sincronización bidireccional entre Tiendanube, MercadoLibre y un ERP local. Stock unificado, sin sobreventas, sin reconciliaciones manuales.",
    stack: ["n8n", "Hono", "Drizzle", "Redis"],
    metric: "0 sobreventas en 4 meses",
  },
  {
    cat: "Software · Salud",
    title: "Lumen Records",
    desc: "Historia clínica simplificada para una red de 6 consultorios. Hecha con los médicos, no para ellos. Cumple con normativa y se usa.",
    stack: ["Next.js", "Supabase", "tRPC", "Tailwind"],
    metric: "92% adopción en semana 2",
  },
  {
    cat: "Landing & Producto",
    title: "Bastión Studio",
    desc: "Sitio + portal de clientes para un estudio jurídico boutique. Carga de causas, notificaciones automáticas y facturación con AFIP.",
    stack: ["Next.js", "Vercel", "Stripe", "Resend"],
    metric: "Lighthouse 100/98/100/100",
  },
];

export default function Projects() {
  return (
    <section id="proyectos" className="relative py-28 lg:py-36 border-t border-line/70 bg-cream/40">
      <div className="shell">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <div className="font-mono-up text-blue mb-4">§ Trabajo seleccionado</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Cosas que ya están <em className="not-italic italic text-mute font-medium">en producción</em>.
            </h2>
          </div>
          <p className="text-[15.5px] text-mute max-w-[46ch] leading-[1.55]">
            Selección de proyectos que mantenemos hoy. Algunos son confidenciales — los presentamos sin nombre real
            cuando hace falta.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} {...p} index={i} />
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between flex-wrap gap-4 border-t border-line pt-8">
          <div className="font-mono-up text-mute">¿Querés ver algo más cercano a tu rubro?</div>
          <a href="#contacto" className="inline-flex items-center gap-2 font-display font-semibold text-ink hover:text-blue">
            Pedir casos relevantes <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ cat, title, desc, stack, metric, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 }}
      className="group relative bg-paper border border-line rounded-3xl overflow-hidden hover:border-ink/30 transition-colors"
    >
      {/* Mockup */}
      <div className="relative h-[260px] lg:h-[300px] bg-ink overflow-hidden">
        <div className="absolute inset-0 dot-grid-dark opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 280px at 20% 0%, rgba(31,64,194,.35), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(242,201,76,.10), transparent 60%)",
          }}
        />
        <div className="absolute left-8 top-8 right-8 bottom-8 rounded-xl border border-paper/15 bg-paper/[0.02] backdrop-blur-[1px] overflow-hidden">
          {/* fake window */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-paper/10">
            <span className="w-2 h-2 rounded-full bg-paper/25" />
            <span className="w-2 h-2 rounded-full bg-paper/25" />
            <span className="w-2 h-2 rounded-full bg-paper/25" />
            <span className="ml-3 font-mono-up text-paper/40 text-[10px]">operon.app / {title.toLowerCase().replace(/\s/g, "-")}</span>
          </div>
          <div className="p-5 grid grid-cols-3 gap-3 h-full">
            <div className="col-span-1 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 rounded bg-paper/10" style={{ width: `${60 + (i % 3) * 12}%` }} />
              ))}
            </div>
            <div className="col-span-2 space-y-3">
              <div className="h-20 rounded-lg bg-paper/[0.04] border border-paper/10 flex items-end p-3">
                <div className="flex items-end gap-1 w-full">
                  {[40, 65, 30, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-blue/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-paper/[0.04] border border-paper/10 p-3">
                  <div className="font-mono-up text-paper/40 text-[10px]">MRR</div>
                  <div className="font-display text-paper text-xl mt-1">$ 14.820</div>
                </div>
                <div className="rounded-lg bg-paper/[0.04] border border-paper/10 p-3">
                  <div className="font-mono-up text-paper/40 text-[10px]">Activos</div>
                  <div className="font-display text-sol text-xl mt-1">312</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-6 bottom-6 right-6 flex items-center justify-between">
          <span className="font-mono-up text-paper/60">{cat}</span>
          <span className="font-mono-up text-sol">{metric}</span>
        </div>
      </div>

      <div className="p-8 lg:p-10">
        <h3 className="font-display font-semibold text-[28px] lg:text-[34px] leading-[1.05] tracking-tight">
          {title}
        </h3>
        <p className="mt-4 text-[15.5px] leading-[1.6] text-mute max-w-[50ch]">{desc}</p>
        <div className="mt-7 flex items-center justify-between flex-wrap gap-4">
          <ul className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <li key={s} className="font-mono-up text-ink/80 border border-line rounded-full px-3 py-1.5 bg-cream/60">
                {s}
              </li>
            ))}
          </ul>
          <a href="#contacto" className="inline-flex items-center gap-1.5 font-display font-semibold text-ink group-hover:text-blue">
            Caso completo <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
