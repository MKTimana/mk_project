import { services } from "@/data/site";

export function Services() {
  return (
    <section id="services" className="services section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <span className="section-kicker">Serviços</span>
          <h2>Soluções para a presença digital e operação da sua empresa.</h2>
          <p>
            Do primeiro website à infraestrutura que mantém a Equipe produtiva, reunimos design, desenvolvimento e
            suporte técnico num serviço direto e organizado.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div
              className="col-xl-4 col-md-6 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay={`${(index % 3) * 100 + 100}`}
              key={service.title}
            >
              <article className="icon-box">
                <div className="icon">
                  <i className={service.icon} />
                </div>
                <h4>
                  <a href="#contact">{service.title}</a>
                </h4>
                <p>{service.description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
