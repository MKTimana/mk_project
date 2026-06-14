const aboutValues = [
  {
    icon: "bi bi-eye",
    title: "Visão",
    text: "Tornar-se a empresa de tecnologias de informação de referência em Moçambique e, progressivamente, na África Austral, liderando a transformação digital com soluções nacionais de excelência."
  },
  {
    icon: "bi bi-bullseye",
    title: "Missão",
    text: "Oferecer soluções tecnológicas inovadoras e acessíveis, desde desenvolvimento web e mobile até infraestrutura de redes e suporte técnico que respondam às necessidades reais do mercado moçambicano, com qualidade, profissionalismo e um atendimento próximo ao cliente."
  },
  {
    icon: "bi bi-flag",
    title: "Objectivo",
    text: "Entregar tecnologia prática, estável e bem acompanhada, mantendo uma relação próxima com cada cliente antes, durante e depois de cada projeto."
  }
];

const companyValues = [
  {
    icon: "bi bi-rocket-takeoff",
    title: "Inovação",
    text: "Estamos sempre um passo à frente"
  },
  {
    icon: "bi bi-check2-square",
    title: "Qualidade",
    text: "Entregamos com rigor e excelência"
  },
  {
    icon: "bi bi-handshake",
    title: "Confiança",
    text: "Relações honestas e duradouras"
  },
  {
    icon: "bi bi-flag",
    title: "Identidade Nacional",
    text: "100% moçambicanos, orgulhosamente"
  },
  {
    icon: "bi bi-lightning-charge",
    title: "Dinamismo",
    text: "Equipa jovem, ágil e proactiva"
  }
];

export function About() {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="about-content about-content-full">
          <span className="section-kicker">Sobre nós</span>
          <h2>Tecnologia moçambicana com foco em resultado.</h2>
          <p>
            A MKTECH é uma empresa de tecnologias de informação liderada por{" "}
            <a href="https://www.linkedin.com/in/milton-kevin-timana-830651137/">Milton Timana</a>. Ajudamos empresas a
            transformar ideias, processos e desafios em soluções digitais claras, seguras e úteis para o dia a dia.
          </p>
          <p>
            Trabalhamos com websites, sistemas, cloud, redes, emails corporativos e assistência técnica, sempre com
            atenção à experiência, estabilidade e evolução do negócio.
          </p>

          <div className="about-values">
            {aboutValues.map((value) => (
              <article className="about-value" key={value.title}>
                <i className={value.icon} />
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="company-values">
            <span className="section-kicker">Valores</span>
            <div className="company-values-list">
              {companyValues.map((value) => (
                <article className="company-value" key={value.title}>
                  <div className="company-value-title">
                    <i className={value.icon} />
                    <h3>{value.title}</h3>
                  </div>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
