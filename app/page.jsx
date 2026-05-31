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
      <Differential />
      <Faq />
      <CtaFinal />
      <Footer />
      <ContactModal />
    </main>
  );
}
