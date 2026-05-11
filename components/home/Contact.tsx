"use client";

import { FormEvent, useState } from "react";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function Contact() {
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = getString(formData, "name");
    const email = getString(formData, "email");
    const phone = getString(formData, "phone");
    const subject = getString(formData, "subject") || "Pedido de contacto pelo website MKTECH";
    const message = getString(formData, "message");

    const body = [
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefone: ${phone || "Não informado"}`,
      "",
      "Mensagem:",
      message
    ].join("\n");

    const mailto = `mailto:geral@mktech.co.mz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setFeedback("O seu aplicativo de email foi aberto com a mensagem preenchida.");
  }

  return (
    <section id="contact" className="contact section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title contact-title">
          <span className="section-kicker">Contactos</span>
          <h2>Entre em Contacto</h2>
          <p>Tem uma ideia, uma necessidade técnica ou um projecto para lançar? Vamos conversar.</p>
        </div>

        <div className="contact-layout contact-layout-form-first">
          <div className="contact-panel contact-intro-panel">
            <span className="contact-pill">Resposta simples e directa</span>
            <h3>Vamos conversar sobre o seu projecto?</h3>
            <p>
              Conte-nos o que pretende criar, corrigir ou melhorar. A MKTECH ajuda a transformar a sua necessidade numa
              solução digital clara, bonita e fácil de manter.
            </p>

            <div className="contact-note-list">
              <span>Websites, sistemas e apps</span>
              <span>Redes, cloud e emails corporativos</span>
              <span>Assistência técnica e suporte empresarial</span>
            </div>
          </div>

          <form className="contact-form enhanced-contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-head">
              <span className="form-eyebrow">Formulário</span>
              <h3>Envie a sua mensagem</h3>
              <p>Preencha os dados abaixo e explique brevemente como podemos ajudar.</p>
            </div>

            <div className="contact-form-grid">
              <input className="form-control" type="text" name="name" placeholder="Seu nome" required />
              <input className="form-control" type="email" name="email" placeholder="Seu e-mail" required />
              <input className="form-control" type="tel" name="phone" placeholder="Seu telefone" />
              <input className="form-control" type="text" name="subject" placeholder="Assunto" />
              <textarea
                className="form-control"
                name="message"
                rows={7}
                placeholder="Como podemos ajudar?"
                required
              />
            </div>

            {feedback ? (
              <p className="contact-feedback contact-feedback-success" role="status">
                {feedback}
              </p>
            ) : null}

            <button className="contact-submit" type="submit">
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
