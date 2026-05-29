"use client";
import { motion } from "framer-motion";

const services = [
  {
    eyebrow: "01 · Automatizaciones",
    title: "Procesos que se ejecutan solos.",
    body: "Conectamos tus herramientas (CRM, mail, WhatsApp, ERP, sheets) para eliminar trabajo manual repetitivo. Si lo hacés más de dos veces por semana, lo automatizamos.",
    bullets: ["n8n self-hosted", "Webhooks tipados", "Logs auditables"],
    icon: "flow",
  },
  {
    eyebrow: "02 · SaaS a medida",
    title: "Productos digitales propios.",
    body: "Diseñamos y construimos SaaS internos o comerciales. Multi-tenant, billing con Stripe, auth moderna y panel admin desde día uno.",
    bullets: ["Next.js · Supabase", "Stripe billing", "Multi-tenant"],
    icon: "saas",
  },
  {
    eyebrow: "03 · Software especializado",
    title: "Lo que no existe todavía.",
    body: "Cuando el software de estantería no cubre tu operación. Integraciones complejas, workflows verticales, paneles operativos para tu equipo.",
    bullets: ["APIs internas", "Dashboards en tiempo real", "Roles & permisos"],
    icon: "code",
  },
  {
    eyebrow: "04 · Desarrollo web moderno",
    title: "Landings & sitios que convierten.",
    body: "Stack moderno, performance real, SEO técnico y diseño que respeta tu marca. Editable por vos sin tocar código.",
    bullets: ["Next.js · Vercel", "CMS headless", "Core Web Vitals A+"],
    icon: "web",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-28 lg:py-36 border-t border-line/70">
      <div className="shell">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-20 items-end mb-16 lg:mb-20">
          <div>
            <div className="font-mono-up text-blue mb-4">§ Servicios</div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5.2vw, 76px)" }}
            >
              Cuatro disciplinas.<br />
              <span className="italic font-medium text-mute">Una sola lógica.</span>
            </h2>
          </div>
          <p className="text-[17px] leading-[1.55] text-mute max-w-[54ch]">
            No vendemos paquetes cerrados. Diagnosticamos tu operación y proponemos lo que
            realmente mueve la aguja — automatizar, construir, integrar o reemplazar. Si no aplica,
            te lo decimos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <ServiceCard key={s.eyebrow} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ eyebrow, title, body, bullets, icon, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="relative bg-paper p-8 lg:p-10 group overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: "radial-gradient(600px 280px at 20% 0%, rgba(31,64,194,.06), transparent 60%)" }}
      />
      <div className="relative flex items-start justify-between gap-6">
        <div className="font-mono-up text-mute">{eyebrow}</div>
        <ServiceIcon name={icon} />
      </div>
      <h3 className="relative font-display font-semibold text-[26px] lg:text-[30px] leading-[1.05] tracking-tight mt-8">
        {title}
      </h3>
      <p className="relative mt-4 text-[15.5px] leading-[1.6] text-mute max-w-[38ch]">{body}</p>
      <ul className="relative mt-7 flex flex-wrap gap-2">
        {bullets.map((b) => (
          <li key={b} className="font-mono-up text-ink/80 border border-line/90 rounded-full px-3 py-1.5 bg-cream/60">
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function ServiceIcon({ name }) {
  const c = "#14130F";
  if (name === "flow")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" className="text-ink">
        <circle cx="8" cy="8" r="3" fill={c} />
        <circle cx="36" cy="8" r="3" fill="#1F40C2" />
        <circle cx="22" cy="22" r="3" fill={c} />
        <circle cx="8" cy="36" r="3" fill="#1F40C2" />
        <circle cx="36" cy="36" r="3" fill={c} />
        <path d="M8 11 V19 Q8 22 11 22 H19" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M36 11 V19 Q36 22 33 22 H25" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M8 33 V25 Q8 22 11 22" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M36 33 V25 Q36 22 33 22" fill="none" stroke={c} strokeWidth="1.2" />
      </svg>
    );
  if (name === "saas")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <rect x="4" y="8" width="36" height="28" rx="4" fill="none" stroke={c} strokeWidth="1.4" />
        <rect x="4" y="8" width="36" height="7" rx="3" fill={c} />
        <circle cx="9" cy="11.5" r="1.1" fill="#F2C94C" />
        <circle cx="13" cy="11.5" r="1.1" fill="#FBF9F4" opacity=".7" />
        <rect x="9" y="20" width="14" height="3" rx="1.5" fill="#1F40C2" />
        <rect x="9" y="26" width="22" height="2" rx="1" fill={c} opacity=".4" />
        <rect x="9" y="30" width="18" height="2" rx="1" fill={c} opacity=".4" />
      </svg>
    );
  if (name === "code")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" stroke={c} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 13 L7 22 L15 31" />
        <path d="M29 13 L37 22 L29 31" />
        <path d="M26 10 L18 34" stroke="#1F40C2" />
      </svg>
    );
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" stroke={c} fill="none" strokeWidth="1.4">
      <circle cx="22" cy="22" r="16" />
      <ellipse cx="22" cy="22" rx="16" ry="6" />
      <path d="M22 6 V38" />
      <path d="M6 22 H38" stroke="#1F40C2" />
    </svg>
  );
}
