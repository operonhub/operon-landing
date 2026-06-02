import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Differential from "@/components/Differential";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import JsonLd from "@/components/JsonLd";

export default function Page() {
  return (
    <main className="relative">
      <JsonLd />
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <Process />
      {/* "Por qué Operon" se oculta en mobile (<768px) para acortar el scroll.
          Sigue en el HTML (display:none) → indexable por Google y sus puntos
          ya se cubren en el FAQ. Visible en tablet y desktop. */}
      <div className="hidden md:block">
        <Differential />
      </div>
      <Faq />
      <CtaFinal />
      <Footer />
      <ContactModal />
    </main>
  );
}
