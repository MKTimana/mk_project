"use client";

import { useEffect, useState } from "react";

const navItems = [
  { href: "#hero", label: "Início" },
  { href: "#about", label: "Sobre nós" },
  { href: "#services", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#cliens", label: "Clientes" },
  { href: "#team", label: "Equipe" },
  { href: "#contact", label: "Contactos" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(navItems[0].href);

  useEffect(() => {
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 140;
      const currentSection = navItems
        .map((item) => document.querySelector<HTMLElement>(item.href))
        .filter((section): section is HTMLElement => Boolean(section))
        .reverse()
        .find((section) => section.offsetTop <= scrollPosition);

      setActiveSection(currentSection ? `#${currentSection.id}` : navItems[0].href);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isOpen);

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header id="header" className="fixed-top">
      {isOpen ? <button className="mobile-menu-backdrop" type="button" aria-label="Fechar menu" onClick={closeMenu} /> : null}

      <div className="container d-flex align-items-center">
        <a href="/" className="logo me-auto" aria-label="MKTECH" onClick={closeMenu}>
          <img src="/assets/img/mklogo.png" alt="MKTECH" className="img-fluid customLogo" />
        </a>

        <nav id="navbar" className={`navbar${isOpen ? " is-open" : ""}`} aria-label="Menu principal">
          <div className="mobile-menu-head">
            <span>Menu</span>
            <button type="button" aria-label="Fechar menu" onClick={closeMenu}>
              <i className="bi bi-x" />
            </button>
          </div>

          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className={`nav-link scrollto${activeSection === item.href ? " active" : ""}`}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.href);
                    closeMenu();
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="navbar"
          onClick={() => setIsOpen((current) => !current)}
        >
          <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`} />
        </button>
      </div>
    </header>
  );
}
