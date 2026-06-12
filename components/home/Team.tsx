import { team } from "@/data/site";

export function Team() {
  return (
    <section id="team" className="team">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <span className="section-kicker">Equipe</span>
          <h2>Quem está por trás das soluções.</h2>
          <p>Uma Equipe jovem, dinâmica e orientada para resolver problemas com qualidade.</p>
        </div>

        <div className="row g-4">
          {team.map((member, index) => (
            <div className="col-lg-4 col-md-6" key={member.name}>
              <article className="member" data-aos="zoom-in" data-aos-delay={`${index * 100 + 100}`}>
                <div className="pic">
                  <img
                    src={member.image}
                    className="img-fluid"
                    alt={member.name}
                    style={member.photoPosition ? { objectPosition: member.photoPosition } : undefined}
                  />
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <span>{member.role}</span>
                  <div className="social">
                    <a target="_blank" rel="noreferrer" href="https://web.facebook.com/mktechnologymz">
                      <i className="ri-facebook-fill" />
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/mktechmz/">
                      <i className="ri-instagram-fill" />
                    </a>
                    <a target="_blank" rel="noreferrer" href={member.linkedin}>
                      <i className={member.linkedinIcon ?? "ri-linkedin-box-fill"} />
                    </a>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
