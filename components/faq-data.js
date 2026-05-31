// Plain data module (no "use client") so it can be imported from both
// the FAQ client component and the JsonLd server component.
export const faqs = [
  {
    q: "¿Cuánto cuesta un proyecto con Operon?",
    a: "Cotizamos por entregable, con precio fijo cerrado antes de empezar. Una automatización puntual puede arrancar desde un monto acotado; un SaaS a medida con billing, auth y panel admin es una inversión mayor. En la llamada inicial de diagnóstico te damos un rango concreto según el alcance real de tu operación, sin letra chica ni costos sorpresa. Si nos pasamos del estimado, lo absorbemos nosotros.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "Trabajamos en sprints de una a dos semanas con una demo en vivo cada viernes. El primer demo funcional lo ves a los 7 días de arrancar. Una landing o automatización simple puede estar en producción en dos o tres semanas; un producto SaaS completo lleva entre uno y tres meses según features. Vos siempre sabés en qué semana estamos y qué viene después.",
  },
  {
    q: "¿El código y la infraestructura quedan míos?",
    a: "Sí, siempre. Cero vendor-lock: el repositorio, la infraestructura, los accesos y los secretos pasan a tu organización desde el día uno. Usamos stack estándar de la industria (Next.js, Postgres, Node, Supabase) para que cualquier desarrollador competente pueda continuar el trabajo. Operon es opcional para el mantenimiento, nunca una condición para que tu software siga funcionando.",
  },
  {
    q: "¿Con qué tecnologías trabajan?",
    a: "Frontend y full-stack con Next.js, React y TypeScript. Base de datos en Postgres y Supabase. Automatizaciones con n8n self-hosted, webhooks tipados y colas. Pagos con Stripe, emails con Resend, mensajería con la API de WhatsApp Cloud. Deploy en Vercel y Cloudflare. Para lógica pesada o IA sumamos Python, FastAPI y modelos de OpenAI o Claude. Elegimos la herramienta según el problema, no al revés.",
  },
  {
    q: "¿Atienden pymes de cualquier rubro?",
    a: "Sí. Ya trabajamos con salud, retail, logística, estudios jurídicos y fábricas. Lo que tienen en común no es el rubro sino el problema: procesos manuales repetitivos, planillas que no escalan, herramientas que no se hablan entre sí. Si hacés algo más de dos veces por semana a mano, probablemente podamos automatizarlo o construir el software que lo resuelva.",
  },
  {
    q: "¿Dónde están y cómo es trabajar con ustedes?",
    a: "Somos un equipo chico de producto basado en Buenos Aires, Argentina. Misma zona horaria, mismo idioma y entendimiento real de cómo opera una pyme argentina. Trabajamos de forma remota y cercana: vas a tener acceso al staging desde el día uno, demos semanales y comunicación directa con quien construye, no con un account manager intermediario.",
  },
];
