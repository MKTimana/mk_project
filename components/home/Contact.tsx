"use client";

import { FormEvent, useState } from "react";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function Contact() {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFeedback("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: getString(formData, "name"),
          email: getString(formData, "email"),
          phone: getString(formData, "phone"),
          subject: getString(formData, "subject"),
          serviceType: getString(formData, "serviceType"),
          message: getString(formData, "message")
        })
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Não foi possível enviar a mensagem.");
      }

      form.reset();
      setFeedback("Mensagem enviada com sucesso. Entraremos em contacto em breve.");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Não foi possível enviar a mensagem.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="contact" className="contact section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title contact-title">
          <span className="section-kicker">Contactos</span>
          <h2>Entre em Contacto</h2>
          <p>Tem uma ideia, uma necessidade técnica ou um projeto para lançar? Vamos conversar.</p>
        </div>

        <div className="contact-layout contact-layout-form-first">
          <div className="contact-panel contact-intro-panel">
            <span className="contact-pill">Resposta simples e direta</span>
            <h3>Vamos conversar sobre o seu projeto?</h3>
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
              <select className="form-control" name="serviceType" defaultValue="" required>
                <option value="" disabled>
                  Tipo de serviço
                </option>
                <option value="Website">Website</option>
                <option value="Sistema ou aplicação">Sistema ou aplicação</option>
                <option value="Redes de computadores">Redes de computadores</option>
                <option value="Email corporativo">Email corporativo</option>
                <option value="Hospedagem e domínio">Hospedagem e domínio</option>
                <option value="Assistência técnica">Assistência técnica</option>
                <option value="Outro">Outro</option>
              </select>
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

            {error ? (
              <p className="contact-feedback contact-feedback-error" role="alert">
                {error}
              </p>
            ) : null}

            <button className="contact-submit" type="submit" disabled={isSending}>
              {isSending ? "A enviar..." : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
