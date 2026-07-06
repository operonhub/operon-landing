import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SITE = "https://operonhub.com";

export const metadata = {
  title: "Política de datos · Operon",
  description:
    "Cómo recopilamos, usamos y protegemos la información que nos compartís cuando nos contactás.",
  alternates: { canonical: `${SITE}/privacidad` },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "1. Quién es responsable",
    body: `Operon es una empresa de desarrollo de software con sede en Buenos Aires, Argentina. Podés contactarnos en cualquier momento por email: admin@operonhub.com.`,
  },
  {
    title: "2. Qué datos recopilamos",
    body: `Cuando completás el formulario de contacto de nuestro sitio, recopilamos:
• Nombre completo
• Nombre de empresa (opcional)
• Dirección de correo electrónico
• Tipo de proyecto y mensaje que nos enviás

No recopilamos datos de navegación con cookies propias, ni utilizamos herramientas de tracking invasivo.`,
  },
  {
    title: "3. Para qué usamos tus datos",
    body: `Usamos la información exclusivamente para:
• Responder a tu consulta o solicitud de presupuesto
• Coordinar una llamada exploratoria si así lo pedís
• Enviarte información relevante sobre el proyecto que nos describiste

No utilizamos tus datos para campañas de marketing masivo, ni los cedemos, vendemos ni compartimos con terceros salvo los servicios técnicos detallados abajo.`,
  },
  {
    title: "4. Servicios de terceros",
    body: `Para gestionar el envío de emails utilizamos Resend (resend.com), un servicio de entrega de correo electrónico con sede en los Estados Unidos. Los datos del formulario pasan por sus servidores únicamente para el envío del mensaje.

El sitio está alojado en Vercel (vercel.com). Vercel puede registrar datos de acceso estándar (IP, user-agent, timestamps) como parte de su infraestructura de hosting.

Ambos servicios operan bajo sus propias políticas de privacidad y cumplen con estándares de seguridad de nivel empresarial.`,
  },
  {
    title: "5. Por cuánto tiempo guardamos tus datos",
    body: `Los mensajes que nos enviás por el formulario quedan registrados en nuestro buzón de correo y se eliminan cuando ya no son necesarios para gestionar tu consulta, o cuando nos lo solicitás explícitamente.`,
  },
  {
    title: "6. Tus derechos",
    body: `De acuerdo con la Ley N° 25.326 de Protección de Datos Personales de la República Argentina, tenés derecho a:
• Acceder a los datos que tengamos sobre vos
• Rectificar datos incorrectos o desactualizados
• Solicitar la supresión de tus datos cuando ya no sean necesarios

Para ejercer cualquiera de estos derechos, envianos un email a admin@operonhub.com con el asunto "Protección de datos" y te respondemos en un plazo no mayor a 5 días hábiles.`,
  },
  {
    title: "7. Seguridad",
    body: `Tomamos medidas razonables para proteger la información que nos compartís. El sitio opera bajo HTTPS y no almacenamos datos sensibles (contraseñas, datos de pago) en nuestros sistemas.`,
  },
  {
    title: "8. Cambios a esta política",
    body: `Podemos actualizar esta política cuando sea necesario. Si los cambios son significativos, lo indicaremos en esta misma página con la fecha de actualización.`,
  },
];

export default function PrivacidadPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper text-ink min-h-screen">
        <div className="shell py-28 lg:py-36">
          {/* Header */}
          <div className="max-w-[720px] mb-16 border-b border-line pb-12">
            <div className="font-mono-up text-blue mb-5">§ Legal</div>
            <h1
              className="font-display font-semibold leading-[0.97] tracking-tightest"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Política de datos.
            </h1>
            <p className="mt-6 text-[16px] leading-[1.6] text-mute max-w-[56ch]">
              Cómo recopilamos, usamos y protegemos la información que nos compartís cuando nos
              contactás.
            </p>
            <p className="mt-4 font-mono-up text-mute/60">Última actualización: julio 2026</p>
          </div>

          {/* Content */}
          <div className="max-w-[680px] space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display font-semibold text-[20px] mb-3">{s.title}</h2>
                <p className="text-[15.5px] leading-[1.7] text-mute whitespace-pre-line">{s.body}</p>
              </div>
            ))}

            {/* Contact box */}
            <div className="mt-16 p-8 bg-cream/60 border border-line rounded-2xl">
              <div className="font-mono-up text-blue mb-3">Contacto</div>
              <p className="text-[15px] leading-[1.6] text-mute">
                Para cualquier consulta relacionada con tus datos personales escribinos a{" "}
                <a
                  href="mailto:admin@operonhub.com"
                  className="text-ink font-medium hover:text-blue transition-colors underline underline-offset-2"
                >
                  admin@operonhub.com
                </a>
                .
              </p>
            </div>

            {/* Back link */}
            <div className="pt-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 font-display font-semibold text-mute hover:text-ink transition-colors"
              >
                ← Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
