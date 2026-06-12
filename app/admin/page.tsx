"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { PortfolioProject } from "@/data/site";

type PortfolioForm = {
  images: string;
  logo: string;
  title: string;
  description: string;
  type: string;
  href: string;
};

const emptyForm: PortfolioForm = {
  images: "",
  logo: "",
  title: "",
  description: "",
  type: "",
  href: ""
};

function parseImageList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((image) => image.trim())
    .filter(Boolean);
}

function getProjectImages(project: PortfolioProject) {
  return project.images?.length ? project.images : [project.image].filter(Boolean);
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState("admin@mktech.co.mz");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const currentPreview = useMemo(
    () => ({
      images: [
        ...imageFiles.map((file) => URL.createObjectURL(file)),
        ...parseImageList(form.images)
      ],
      logo: logoFile ? URL.createObjectURL(logoFile) : form.logo
    }),
    [form.images, form.logo, imageFiles, logoFile]
  );

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          loadProjects();
        }
      })
      .finally(() => setIsCheckingSession(false));
  }, []);

  async function loadProjects() {
    const response = await fetch("/api/admin/portfolio");
    if (response.ok) {
      setProjects(await response.json());
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setLoginError("Email ou password incorrectos.");
      return;
    }

    setPassword("");
    setIsAuthenticated(true);
    await loadProjects();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setProjects([]);
    resetForm();
  }

  function updateField(field: keyof PortfolioForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildFormData() {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("image", parseImageList(form.images)[0] || "");

    imageFiles.forEach((imageFile) => formData.append("imageFiles", imageFile));

    if (logoFile) {
      formData.append("logoFile", logoFile);
    }

    return formData;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const url = editingSlug ? `/api/admin/portfolio/${editingSlug}` : "/api/admin/portfolio";
    const method = editingSlug ? "PUT" : "POST";
    const response = await fetch(url, { method, body: buildFormData() });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.message || "Não foi possível guardar. Verifique os campos e tente novamente.");
      setIsSaving(false);
      return;
    }

    await loadProjects();
    resetForm();
    setStatus(editingSlug ? "Portfólio atualizado com sucesso." : "Portfólio adicionado com sucesso.");
    setIsSaving(false);
  }

  function editProject(project: PortfolioProject) {
    setEditingSlug(project.slug);
    setForm({
      images: getProjectImages(project).join("\n"),
      logo: project.logo,
      title: project.title,
      description: project.description,
      type: project.type,
      href: project.href
    });
    setImageFiles([]);
    setLogoFile(null);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProject(project: PortfolioProject) {
    const confirmed = window.confirm(`Remover "${project.title}" do portfólio?`);
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/portfolio/${project.slug}`, { method: "DELETE" });
    if (response.ok) {
      await loadProjects();
      if (editingSlug === project.slug) {
        resetForm();
      }
    }
  }

  function resetForm() {
    setEditingSlug(null);
    setForm(emptyForm);
    setImageFiles([]);
    setLogoFile(null);
  }

  if (isCheckingSession) {
    return <main className="admin-shell admin-centered">A carregar...</main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-shell admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <a className="admin-brand" href="/">
            <img src="/assets/img/mklogo.png" alt="MKTECH" />
          </a>
          <h1>Área de Administração</h1>
          <p>Entre para gerir os cartões do portfólio publicados no site.</p>

          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>

          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>

          {loginError ? <span className="admin-error">{loginError}</span> : null}

          <button type="submit">Entrar</button>
          <a className="admin-back-link" href="/">
            Voltar ao site
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="admin-brand" href="/">
          <img src="/assets/img/mklogo.png" alt="MKTECH" />
          <span>Admin Portfólio</span>
        </a>
        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section className="admin-grid">
        <form className="admin-panel admin-form" onSubmit={handleSave}>
          <div>
            <span className="admin-kicker">{editingSlug ? "Editar card" : "Novo card"}</span>
            <h1>{editingSlug ? "Atualizar portfólio" : "Adicionar portfólio"}</h1>
          </div>

          <label>
            Título do portfólio
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          </label>

          <label>
            Tipo de trabalho
            <input
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
              placeholder="Website, Assistência Técnica, Hosting..."
              required
            />
          </label>

          <label>
            Link do trabalho
            <input value={form.href} onChange={(event) => updateField("href", event.target.value)} type="url" required />
          </label>

          <label>
            Descrição
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} required />
          </label>

          <label>
            Imagens do trabalho
            <input
              accept="image/*"
              multiple
              onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
              required={!form.images && !imageFiles.length}
              type="file"
            />
          </label>

          <label>
            Logo do cliente
            <input
              accept="image/*"
              onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
              required={!form.logo && !logoFile}
              type="file"
            />
          </label>

          <div className="admin-actions">
            <button disabled={isSaving} type="submit">
              {isSaving ? "A guardar..." : editingSlug ? "Guardar alterações" : "Adicionar cartão"}
            </button>
            {editingSlug ? (
              <button className="admin-secondary" type="button" onClick={resetForm}>
                Cancelar
              </button>
            ) : null}
          </div>

          {status ? <span className="admin-status">{status}</span> : null}
        </form>

        <aside className="admin-panel admin-preview">
          <span className="admin-kicker">Pré-visualização</span>
          <article className="portfolio-card portfolio-work-card">
            <div className="portfolio-template">
              {currentPreview.images[0] ? <img src={currentPreview.images[0]} alt="" /> : null}
              {currentPreview.images.length > 1 ? (
                <span className="portfolio-gallery-count">
                  <i className="bi bi-images" />
                  {currentPreview.images.length}
                </span>
              ) : null}
              <div className="portfolio-image-caption">
                <span>{form.type || "Tipo de trabalho"}</span>
                <strong>{form.title || "Título do portfólio"}</strong>
              </div>
            </div>
            <div className="portfolio-work-body">
              <span className="portfolio-work-type">{form.type || "Categoria"}</span>
              <h3>{form.title || "Nome do projeto"}</h3>
              <p>{form.description || "A descrição preenchida aqui será transformada num cartão igual aos cartões do site."}</p>
            </div>
          </article>
          {currentPreview.logo ? (
            <div className="admin-logo-preview">
              <img src={currentPreview.logo} alt="Logo do cliente" />
            </div>
          ) : null}
        </aside>
      </section>

      <section className="admin-panel admin-list">
        <div>
          <span className="admin-kicker">Portfólio publicado</span>
          <h2>{projects.length} cartões</h2>
        </div>

        <div className="admin-project-list">
          {projects.map((project) => (
            <article className="admin-project-row" key={project.slug}>
              <img src={getProjectImages(project)[0]} alt="" />
              <div>
                <strong>{project.title}</strong>
                <span>{project.type}</span>
                <span className="admin-project-gallery-count">{getProjectImages(project).length} imagem(ns)</span>
                <p>{project.description}</p>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => editProject(project)}>
                  Editar
                </button>
                <button className="admin-danger" type="button" onClick={() => deleteProject(project)}>
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
