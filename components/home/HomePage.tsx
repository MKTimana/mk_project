import { About } from "./About";
import { Clients } from "./Clients";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { FloatingWhatsapp } from "./FloatingWhatsapp";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LoadingScreen } from "./LoadingScreen";
import { Portfolio } from "./Portfolio";
import { Services } from "./Services";
import { Team } from "./Team";

export function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Header />
      <Hero />
      <main id="main">
        <About />
        <Services />
        <Portfolio />
        <Clients />
        <Team />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  );
}
