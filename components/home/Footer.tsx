export function Footer() {
  return (
    <footer id="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <a href="#hero" aria-label="MKTECH">
            <img src="/assets/img/MKTECH_White.png" alt="MKTECH" />
          </a>
          <p>Soluções digitais simples, bonitas e preparadas para empresas que querem crescer com tecnologia.</p>
          <div className="footer-socials" aria-label="Redes sociais">
            <a target="_blank" rel="noreferrer" href="https://web.facebook.com/mktechnologymz" aria-label="Facebook">
              <i className="ri-facebook-fill" />
            </a>
            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/mktechmz/" aria-label="Instagram">
              <i className="ri-instagram-fill" />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/company/mktechmz/"
              aria-label="LinkedIn"
            >
              <i className="ri-linkedin-fill" />
            </a>
            <a href="whatsapp://send?phone=+258869736169&text=Olá! Quero falar com a MKTECH." aria-label="Whatsapp">
              <i className="ri-whatsapp-fill" />
            </a>
          </div>
        </div>

        <div className="footer-column footer-contact">
          <h3>Contactos</h3>
          <ul>
            <li>
              <i className="bi bi-geo-alt" />
              Maputo, Moçambique
            </li>
            <li>
              <i className="bi bi-phone" />
              <a href="tel:+258869736169">+258 86 973 6169</a>
            </li>
            <li>
              <i className="bi bi-envelope" />
              <a href="mailto:geral@mktech.co.mz">geral@mktech.co.mz</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="copyright">
          &copy; 2026 <strong>MKTECH</strong>. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
