"use client";

import { usePortfolioProjects } from "./usePortfolioProjects";

export function Clients() {
  const portfolioProjects = usePortfolioProjects();

  return (
    <section id="cliens" className="portfolio clients-section section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <span className="section-kicker">Clientes</span>
          <h2>Empresas e projetos que confiaram na MKTECH.</h2>
          <p>Trabalhos realizados em websites, suporte técnico, hosting e soluções digitais para clientes reais.</p>
        </div>

        <div className="row portfolio-container clients-project-grid g-4" data-aos="fade-up" data-aos-delay="100">
          {portfolioProjects.map((project) => (
            <div className="col-lg-3 col-md-4 col-6 portfolio-item" key={project.title}>
              <a
                className="portfolio-card client-project-card"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir ${project.title}`}
              >
                <div className="portfolio-img">
                  <img src={project.logo} className="img-fluid" alt={project.title} />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
