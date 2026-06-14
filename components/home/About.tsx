const aboutValues = [
  {
    icon: "bi bi-eye",
    title: "Visão",
    text: "Ser uma referência moçambicana em soluções tecnológicas que aproximam empresas de processos mais simples, seguros e eficientes."
  },
  {
    icon: "bi bi-bullseye",
    title: "Missão",
    text: "Criar websites, sistemas, infraestrutura e suporte técnico que resolvem necessidades reais e ajudam os clientes a crescer com confiança."
  },
  {
    icon: "bi bi-flag",
    title: "Objectivo",
    text: "Entregar tecnologia prática, estável e bem acompanhada, mantendo uma relação próxima com cada cliente antes, durante e depois de cada projeto."
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
        </div>
      </div>
    </section>
  );
}
