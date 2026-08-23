import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";

const SITE = "https://operonhub.com";

export const metadata = {
  title: "Contanos tu proceso",
  description:
    "Desarrollamos aplicaciones personalizadas según la forma de trabajar de cada empresa. Contanos brevemente tu caso y nos comunicamos para conocerlo mejor.",
  alternates: { canonical: `${SITE}/contanos-tu-proceso` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE}/contanos-tu-proceso`,
    title: "Contanos qué proceso te gustaría simplificar · Operon",
    description:
      "Aplicaciones personalizadas según la forma de trabajar de cada empresa. Contanos tu caso.",
  },
};

export default function ContanosTuProcesoPage() {
  return (
    <>
      <Nav />
      <main className="relative overflow-hidden bg-paper text-ink">
        {/* Halo azul sutil, consistente con el resto del sitio */}
        <div
          className="pointer-events-none absolute -top-40 -right-40 h-[620px] w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(31,64,194,.12), rgba(31,64,194,0) 70%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" aria-hidden />

        <div className="shell relative py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-start">
            {/* Columna de texto */}
            <div className="lg:sticky lg:top-24">
              <div className="mb-5 font-mono-up text-blue">§ Aplicaciones a medida</div>
              <h1
                className="font-display font-semibold leading-[0.98] tracking-tightest"
                style={{ fontSize: "clamp(34px, 5vw, 60px)" }}
              >
                Contanos qué proceso te gustaría simplificar
              </h1>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink/90">
                En Operon desarrollamos aplicaciones personalizadas según la forma de
                trabajar de cada empresa. Contanos brevemente tu caso y nos comunicaremos
                para conocerlo mejor.
              </p>

              <div className="mt-8 max-w-[52ch] rounded-2xl border border-line bg-cream/50 p-5">
                <p className="text-[15px] leading-[1.6] text-mute">
                  No vendemos un sistema estándar. Primero conocemos cómo trabaja tu empresa
                  y después diseñamos una herramienta para simplificar ese proceso.
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
