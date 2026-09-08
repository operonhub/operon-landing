import { DEMO_URL, faqs } from "./datos";

const SUBDOMINIO = "https://reservas.operonhub.com";

/**
 * Datos estructurados de la landing de Operon Reservas.
 *
 * `SoftwareApplication` describe el producto y `FAQPage` reutiliza exactamente
 * las mismas preguntas que se ven en pantalla: Google desestima (y puede
 * penalizar) el marcado que no coincide con el contenido visible.
 *
 * Seguridad: el JSON se arma sólo con constantes de este repositorio — no entra
 * nada del usuario ni de la red. Aun así se escapa cada `<` a su secuencia
 * unicode, que es el único vector real acá: impide que un texto que llegue a
 * contener un cierre de script termine la etiqueta antes de tiempo. Es el mismo patrón que ya usa
 * `components/JsonLd.jsx` para la home.
 */
export default function JsonLdReservas() {
  const datos = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Operon Reservas",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SUBDOMINIO}/`,
      inLanguage: "es-AR",
      description:
        "Motor de reservas multi-alojamiento para cabañas y hospedajes chicos: calendario por unidad, tarifas por noche, cobro de seña con Mercado Pago y confirmaciones automáticas.",
      author: { "@type": "Organization", name: "Operon", url: "https://operonhub.com/" },
      publisher: { "@type": "Organization", name: "Operon", url: "https://operonhub.com/" },
      areaServed: "AR",
      featureList: [
        "Calendario de disponibilidad por unidad",
        "Reservas directas desde la web del propietario",
        "Cobro de seña con Mercado Pago",
        "Confirmaciones automáticas por email",
        "Tarifas por noche con reglas",
        "Feed iCal por unidad",
        "Prevención de sobreventa a nivel base de datos",
      ],
      potentialAction: { "@type": "ViewAction", name: "Ver la demo", target: DEMO_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const serializado = JSON.stringify(datos).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializado }}
    />
  );
}
