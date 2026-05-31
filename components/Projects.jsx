"use client";
import { motion } from "framer-motion";

const projects = [
  {
    live: true,
    url: "https://nutri-studio.vercel.app/",
    image: "/projects/nutri-studio.png",
    cat: "SaaS · Salud",
    title: "Nutri Studio",
    desc: "Plataforma de visualización clínica para nutricionistas. Procesa los informes de composición corporal del InBody y los traduce a gráficos claros para que los pacientes entiendan sus resultados.",
    stack: ["Next.js", "Supabase", "Tailwind", "TypeScript"],
    metric: "En producción",
  },
  {
    live: true,
    url: "https://aberturas-far.vercel.app/",
    image: "/projects/aberturas-far.png",
    cat: "Web corporativa",
    title: "Aberturas FAR",
    desc: "Sitio para una fábrica de aberturas de aluminio en Florencio Varela. Catálogo de 3 líneas de producto, presupuestador, formulario de contacto y SEO local. Rápido, editable y enfocado a generar leads reales.",
    stack: ["HTML5 · CSS3", "JS vanilla", "SEO local"],
    metric: "Lighthouse 99/100",
  },
  {
    live: false,
    cat: "Automatización · Retail",
    title: "Flujo Onix",
    desc: "Sincronización bidireccional entre Tiendanube, MercadoLibre y un ERP local. Stock unificado, sin sobreventas, sin reconciliaciones manuales.",
    stack: ["n8n", "Hono", "Drizzle", "Redis"],
    metric: "Próximamente",
  },
  {
    live: false,
    cat: "Software · Logística",
    title: "Cargo Atlas",
    desc: "Plataforma de seguimiento de cargas en tiempo real para una operadora de transporte regional. Reemplazó 4 planillas y un grupo de WhatsApp.",
    stack: ["Next.js", "Postgres", "Mapbox", "WhatsApp Cloud"],
    metric: "Próximamente",
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
            Selección de proyectos. Hacé click para visitar los que están live —
            o pedinos los casos completos que aún no podemos mostrar acá.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} {...p} index={i} />
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between flex-wrap gap-4 border-t border-line pt-8">
          <div className="font-mono-up text-mute">¿Querés ver algo más cercano a tu rubro?</div>
          <button
            type="button"
            data-open-contact
            className="inline-flex items-center gap-2 font-display font-semibold text-ink hover:text-blue"
          >
            Pedir casos relevantes <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ live, url, image, cat, title, desc, stack, metric, index }) {
  const Wrapper = live ? "a" : "div";
  const wrapperProps = live
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 }}
    >
      <Wrapper
        {...wrapperProps}
        className={`group block relative bg-paper border border-line rounded-3xl overflow-hidden transition-colors ${
          live ? "hover:border-ink/30 cursor-pointer" : "opacity-95"
        }`}
      >
        {/* Live preview / mockup */}
        <div className="relative h-[280px] lg:h-[320px] bg-ink overflow-hidden">
          {live ? (
            <LivePreview url={url} title={title} image={image} />
          ) : (
            <FauxMockup title={title} />
          )}

          <div className="absolute left-6 bottom-6 right-6 flex items-center justify-between z-10">
            <span className="font-mono-up text-paper/70 bg-ink/60 backdrop-blur px-2.5 py-1 rounded-full">
              {cat}
            </span>
            <span className={`font-mono-up ${live ? "text-sol" : "text-paper/50"} bg-ink/60 backdrop-blur px-2.5 py-1 rounded-full`}>
              {live && <span className="inline-block w-1.5 h-1.5 rounded-full bg-sol mr-1.5 align-middle" />}
              {metric}
            </span>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display font-semibold text-[28px] lg:text-[34px] leading-[1.05] tracking-tight">
              {title}
            </h3>
            {live && (
              <span className="mt-2 shrink-0 font-mono-up text-mute group-hover:text-blue transition-colors">
                {new URL(url).hostname}
              </span>
            )}
          </div>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-mute max-w-[54ch]">{desc}</p>
          <div className="mt-7 flex items-center justify-between flex-wrap gap-4">
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="font-mono-up text-ink/80 border border-line rounded-full px-3 py-1.5 bg-cream/60">
                  {s}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 font-display font-semibold text-ink group-hover:text-blue">
              {live ? "Visitar sitio" : "Próximamente"}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

function LivePreview({ url, title, image }) {
  return (
    <>
      {/* Browser chrome */}
      <div className="absolute left-6 top-6 right-6 bottom-16 rounded-xl border border-paper/15 bg-paper/[0.04] backdrop-blur-[1px] overflow-hidden flex flex-col">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-paper/10 shrink-0">
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="ml-3 font-mono-up text-paper/50 text-[10px] truncate">
            {new URL(url).hostname}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={`Captura de ${title}`}
          loading="lazy"
          className="block w-full flex-1 object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px 280px at 20% 0%, rgba(31,64,194,.25), transparent 60%)",
        }}
      />
    </>
  );
}

function FauxMockup({ title }) {
  return (
    <>
      <div className="absolute inset-0 dot-grid-dark opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 280px at 20% 0%, rgba(31,64,194,.28), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(242,201,76,.08), transparent 60%)",
        }}
      />
      <div className="absolute left-8 top-8 right-8 bottom-16 rounded-xl border border-paper/15 bg-paper/[0.02] backdrop-blur-[1px] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-paper/10">
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="w-2 h-2 rounded-full bg-paper/25" />
          <span className="ml-3 font-mono-up text-paper/40 text-[10px]">
            operon.app / {title.toLowerCase().replace(/\s/g, "-")}
          </span>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3 h-full">
          <div className="col-span-1 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded bg-paper/10"
                style={{ width: `${60 + (i % 3) * 12}%` }}
              />
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
          </div>
        </div>
      </div>
    </>
  );
}
