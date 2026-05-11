function HeroTechVisual() {
  return (
    <div className="hero-tech-card" aria-label="MKTECH">
      <div className="hero-tech-grid" />
      <div className="hero-tech-glow" />
      <div className="hero-tech-beam hero-tech-beam-one" />
      <div className="hero-tech-beam hero-tech-beam-two" />
      <div className="hero-tech-orbit hero-tech-orbit-one" />
      <div className="hero-tech-orbit hero-tech-orbit-two" />

      <div className="hero-tech-core">
        <img src="/assets/img/mklogo.png" alt="MKTECH" />
      </div>

      <div className="hero-tech-node hero-tech-node-one" />
      <div className="hero-tech-node hero-tech-node-two" />
      <div className="hero-tech-node hero-tech-node-three" />

      <div className="hero-tech-chip-orbit hero-tech-chip-orbit-one">
        <div className="hero-tech-chip">
          <i className="bi bi-globe2" />
          Websites
        </div>
      </div>
      <div className="hero-tech-chip-orbit hero-tech-chip-orbit-two">
        <div className="hero-tech-chip">
          <i className="bi bi-cloud-check" />
          Cloud
        </div>
      </div>
      <div className="hero-tech-chip-orbit hero-tech-chip-orbit-three">
        <div className="hero-tech-chip">
          <i className="bi bi-diagram-3" />
          Redes
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" className="d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6 d-flex flex-column justify-content-center order-2 order-lg-1">
            <span className="hero-kicker">MKTECH · Tecnologia para empresas</span>
            <h1>Tecnologia estratégica para empresas que querem crescer com segurança.</h1>
            <div className="hero-mobile-visual">
              <HeroTechVisual />
            </div>
            <h2>
              Criamos websites, sistemas, apps, emails corporativos, cloud, redes e suporte técnico para empresas em
              Moçambique.
            </h2>
            <div className="hero-actions d-flex justify-content-center justify-content-lg-start">
              <a
                href="https://wa.me/258869736169?text=Ol%C3%A1!%20Quero%20solicitar%20um%20or%C3%A7amento."
                target="_blank"
                rel="noreferrer"
                className="btn-get-started scrollto"
              >
                Solicitar orçamento
              </a>
              <a href="#cliens" className="btn-watch-video">
                <i className="bi bi-arrow-up-right-circle" />
                <span>Ver clientes</span>
              </a>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2 hero-img hero-desktop-visual">
            <HeroTechVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
