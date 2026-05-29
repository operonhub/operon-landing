import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Differential from "@/components/Differential";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Differential />
      <CtaFinal />
      <Footer />
      <ContactModal />
    </main>
  );
}
