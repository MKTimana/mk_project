"use client";

import { useClients } from "./useClients";

export function Clients() {
  const clients = useClients();

  return (
    <section id="cliens" className="portfolio clients-section section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <span className="section-kicker">Clientes</span>
          <h2>Empresas e projetos que confiaram na MKTECH.</h2>
          <p>Trabalhos realizados em websites, suporte técnico, hosting e soluções digitais para clientes reais.</p>
        </div>

        <div className="row portfolio-container clients-project-grid g-4" data-aos="fade-up" data-aos-delay="100">
          {clients.map((client) => (
            <div className="col-lg-3 col-md-4 col-6 portfolio-item" key={client.slug}>
              {client.href ? (
              <a className="portfolio-card client-project-card" href={client.href} target="_blank" rel="noreferrer" aria-label={`Abrir ${client.name}`}>
                <div className="portfolio-img">
                  <img src={client.logo} className="img-fluid" alt={client.name} />
                </div>
              </a>
              ) : (
                <div className="portfolio-card client-project-card" aria-label={client.name}>
                  <div className="portfolio-img">
                    <img src={client.logo} className="img-fluid" alt={client.name} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
