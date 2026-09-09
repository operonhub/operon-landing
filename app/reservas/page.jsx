import NavReservas from "@/components/reservas/NavReservas";
import HeroReservas from "@/components/reservas/HeroReservas";
import Funciones from "@/components/reservas/Funciones";
import SinSobreventa from "@/components/reservas/SinSobreventa";
import Comparacion from "@/components/reservas/Comparacion";
import Conexion from "@/components/reservas/Conexion";
import EnElCelular from "@/components/reservas/EnElCelular";
import PreguntasReservas from "@/components/reservas/PreguntasReservas";
import CtaFinalReservas from "@/components/reservas/CtaFinalReservas";
import FooterReservas from "@/components/reservas/FooterReservas";
import JsonLdReservas from "@/components/reservas/JsonLdReservas";
import ContactModal from "@/components/ContactModal";

const SUBDOMINIO = "https://reservas.operonhub.com";

export const metadata = {
  // `absolute` evita la plantilla "%s · Operon" del layout raíz: en el
  // subdominio el título ya dice Operon y quedaba repetido dos veces.
  title: {
    absolute: "Operon Reservas — Reservas directas para cabañas y alojamientos",
  },
  description:
    "El motor de reservas que va abajo de tu propia web: disponibilidad real, seña por Mercado Pago, confirmaciones automáticas y cero chances de vender dos veces la misma noche. Sin comisión por reserva.",
  keywords: [
    "motor de reservas",
    "sistema de reservas cabañas",
    "reservas directas",
    "software para alojamientos",
    "sin comisión Booking",
    "Mercado Pago reservas",
  ],
  // La página se sirve en dos hosts (operonhub.com/reservas y el subdominio).
  // El canónico apunta al subdominio, que es la URL que se difunde.
  alternates: { canonical: `${SUBDOMINIO}/` },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: `${SUBDOMINIO}/`,
    siteName: "Operon Reservas",
    title: "Operon Reservas — Tus reservas entran directo, sin comisión en el medio",
    description:
      "Motor de reservas para cabañas y alojamientos chicos. Calendario, tarifas, cobro de seña y avisos automáticos, abajo de tu propia web.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operon Reservas — Reservas directas, sin comisión",
    description:
      "Calendario, tarifas, cobro de seña y avisos automáticos, abajo de tu propia web.",
  },
};

export default function PaginaReservas() {
  return (
    <main className="relative">
      <JsonLdReservas />
      <NavReservas />
      <HeroReservas />
      <Funciones />
      <SinSobreventa />
      <Comparacion />
      <Conexion />
      <EnElCelular />
      <PreguntasReservas />
      <CtaFinalReservas />
      <FooterReservas />
      {/* El mismo modal de contacto del sitio principal: los botones
          `data-open-contact` de esta página lo abren sin configuración extra. */}
      <ContactModal />
    </main>
  );
}
