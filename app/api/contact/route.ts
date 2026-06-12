import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  serviceType?: unknown;
  message?: unknown;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${key}`);
  }

  return value;
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const name = getString(payload.name);
  const email = getString(payload.email);
  const phone = getString(payload.phone);
  const subject = getString(payload.subject) || "Pedido de contacto pelo website MKTECH";
  const serviceType = getString(payload.serviceType);
  const message = getString(payload.message);

  if (!name || !email || !serviceType || !message) {
    return NextResponse.json({ error: "Preencha nome, email, tipo de serviço e mensagem." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Informe um email válido." }, { status: 400 });
  }

  try {
    const smtpPort = Number(process.env.SMTP_PORT || "587");
    const secure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
    const smtpUser = getRequiredEnv("SMTP_USER");
    const to = process.env.CONTACT_TO_EMAIL || "geral@mktech.co.mz";
    const from = process.env.SMTP_FROM_EMAIL || smtpUser;

    const transporter = nodemailer.createTransport({
      host: getRequiredEnv("SMTP_HOST"),
      port: smtpPort,
      secure,
      auth: {
        user: smtpUser,
        pass: getRequiredEnv("SMTP_PASS")
      }
    });

    const text = [
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefone: ${phone || "Não informado"}`,
      `Tipo de serviço: ${serviceType}`,
      "",
      "Mensagem:",
      message
    ].join("\n");

    const html = `
      <h2>Novo contacto pelo website MKTECH</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(phone || "Não informado")}</p>
      <p><strong>Tipo de serviço:</strong> ${escapeHtml(serviceType)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      envelope: {
        from: smtpUser,
        to
      },
      subject,
      text,
      html
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar email de contacto:", error);

    return NextResponse.json(
      { error: "Não foi possível enviar a mensagem. Verifique a configuração do email." },
      { status: 500 }
    );
  }
}
