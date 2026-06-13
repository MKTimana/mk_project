"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ClientLogo, PortfolioCategory, PortfolioProject } from "@/data/site";

type AdminUser = {
  email: string;
  role: "admin" | "editor";
};

type AdminTab = "portfolio" | "clients" | "categories";

type PortfolioForm = {
  images: string;
  logo: string;
  title: string;
  description: string;
  type: string;
  href: string;
};

type ClientForm = {
  name: string;
  logo: string;
  href: string;
};

type CategoryForm = {
  name: string;
  description: string;
};

const emptyPortfolioForm: PortfolioForm = { images: "", logo: "", title: "", description: "", type: "", href: "" };
const emptyClientForm: ClientForm = { name: "", logo: "", href: "" };
const emptyCategoryForm: CategoryForm = { name: "", description: "" };

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
  const [user, setUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("admin@mktech.co.mz");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("portfolio");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioForm>(emptyPortfolioForm);
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClientForm);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingPortfolioSlug, setEditingPortfolioSlug] = useState<string | null>(null);
  const [editingClientSlug, setEditingClientSlug] = useState<string | null>(null);
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [portfolioLogoFile, setPortfolioLogoFile] = useState<File | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canDelete = user?.role === "admin";

  const currentPreview = useMemo(
    () => ({
      images: [...imageFiles.map((file) => URL.createObjectURL(file)), ...parseImageList(portfolioForm.images)],
      logo: portfolioLogoFile ? URL.createObjectURL(portfolioLogoFile) : portfolioForm.logo
    }),
    [portfolioForm.images, portfolioForm.logo, imageFiles, portfolioLogoFile]
  );

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
        setUser(data.user || null);
        if (data.authenticated) {
          loadAll();
        }
      })
      .finally(() => setIsCheckingSession(false));
  }, []);

  async function loadAll() {
    await Promise.all([loadProjects(), loadClients(), loadCategories()]);
  }

  async function loadProjects() {
    const response = await fetch("/api/admin/portfolio");
    if (response.ok) setProjects(await response.json());
  }

  async function loadClients() {
    const response = await fetch("/api/admin/clients");
    if (response.ok) setClients(await response.json());
  }

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    if (response.ok) setCategories(await response.json());
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

    const data = await response.json();
    setPassword("");
    setUser(data.user);
    setIsAuthenticated(true);
    await loadAll();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setUser(null);
    setProjects([]);
    setClients([]);
    setCategories([]);
    resetForms();
  }

  function updatePortfolioField(field: keyof PortfolioForm, value: string) {
    setPortfolioForm((current) => ({ ...current, [field]: value }));
  }

  function buildPortfolioFormData() {
    const formData = new FormData();
    Object.entries(portfolioForm).forEach(([key, value]) => formData.append(key, value));
    formData.append("image", parseImageList(portfolioForm.images)[0] || "");
    imageFiles.forEach((imageFile) => formData.append("imageFiles", imageFile));
    if (portfolioLogoFile) formData.append("logoFile", portfolioLogoFile);
    return formData;
  }

  async function savePortfolio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const url = editingPortfolioSlug ? `/api/admin/portfolio/${editingPortfolioSlug}` : "/api/admin/portfolio";
    const method = editingPortfolioSlug ? "PUT" : "POST";
    const response = await fetch(url, { method, body: buildPortfolioFormData() });

    await finishSave(response, loadProjects, () => {
      resetPortfolioForm();
      return editingPortfolioSlug ? "Portfolio atualizado com sucesso." : "Portfolio adicionado com sucesso.";
    });
  }

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const formData = new FormData();
    Object.entries(clientForm).forEach(([key, value]) => formData.append(key, value));
    if (clientLogoFile) formData.append("logoFile", clientLogoFile);

    const url = editingClientSlug ? `/api/admin/clients/${editingClientSlug}` : "/api/admin/clients";
    const method = editingClientSlug ? "PUT" : "POST";
    const response = await fetch(url, { method, body: formData });

    await finishSave(response, loadClients, () => {
      resetClientForm();
      return editingClientSlug ? "Cliente atualizado com sucesso." : "Cliente adicionado com sucesso.";
    });
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const url = editingCategorySlug ? `/api/admin/categories/${editingCategorySlug}` : "/api/admin/categories";
    const method = editingCategorySlug ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm)
    });

    await finishSave(response, loadCategories, () => {
      resetCategoryForm();
      return editingCategorySlug ? "Categoria atualizada com sucesso." : "Categoria adicionada com sucesso.";
    });
  }

  async function finishSave(response: Response, reload: () => Promise<void>, onSuccess: () => string) {
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.message || "Nao foi possivel guardar. Verifique os campos e tente novamente.");
      setIsSaving(false);
      return;
    }

    const message = onSuccess();
    await reload();
    setStatus(message);
    setIsSaving(false);
  }

  function editProject(project: PortfolioProject) {
    setActiveTab("portfolio");
    setEditingPortfolioSlug(project.slug);
    setPortfolioForm({
      images: getProjectImages(project).join("\n"),
      logo: project.logo,
      title: project.title,
      description: project.description,
      type: project.type,
      href: project.href || ""
    });
    setImageFiles([]);
    setPortfolioLogoFile(null);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editClient(client: ClientLogo) {
    setActiveTab("clients");
    setEditingClientSlug(client.slug);
    setClientForm({ name: client.name, logo: client.logo, href: client.href || "" });
    setClientLogoFile(null);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editCategory(category: PortfolioCategory) {
    setActiveTab("categories");
    setEditingCategorySlug(category.slug);
    setCategoryForm({ name: category.name, description: category.description || "" });
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteItem(label: string, url: string, reload: () => Promise<void>, afterDelete?: () => void) {
    if (!canDelete) {
      setStatus("Apenas administradores podem apagar conteudo.");
      return;
    }

    if (!window.confirm(`Remover "${label}"?`)) return;

    const response = await fetch(url, { method: "DELETE" });
    if (response.ok) {
      afterDelete?.();
      await reload();
      setStatus("Item removido com sucesso.");
      return;
    }

    const data = await response.json().catch(() => null);
    setStatus(data?.message || "Nao foi possivel remover.");
  }

  function resetPortfolioForm() {
    setEditingPortfolioSlug(null);
    setPortfolioForm(emptyPortfolioForm);
    setImageFiles([]);
    setPortfolioLogoFile(null);
  }

  function resetClientForm() {
    setEditingClientSlug(null);
    setClientForm(emptyClientForm);
    setClientLogoFile(null);
  }

  function resetCategoryForm() {
    setEditingCategorySlug(null);
    setCategoryForm(emptyCategoryForm);
  }

  function resetForms() {
    resetPortfolioForm();
    resetClientForm();
    resetCategoryForm();
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
          <h1>Area de Administracao</h1>
          <p>Entre para gerir portfolios, clientes e categorias publicados no site.</p>
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
          <span>Painel MKTECH</span>
        </a>
        <div className="admin-userbar">
          <span>{user?.email}</span>
          <strong>{user?.role === "admin" ? "Admin" : "Editor"}</strong>
          <button type="button" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Modulos do admin">
        <button className={activeTab === "portfolio" ? "active" : ""} type="button" onClick={() => setActiveTab("portfolio")}>
          Portfolios
        </button>
        <button className={activeTab === "clients" ? "active" : ""} type="button" onClick={() => setActiveTab("clients")}>
          Clientes
        </button>
        <button className={activeTab === "categories" ? "active" : ""} type="button" onClick={() => setActiveTab("categories")}>
          Categorias
        </button>
      </nav>

      {status ? <div className="admin-status admin-global-status">{status}</div> : null}

      {activeTab === "portfolio" ? (
        <>
          <section className="admin-grid">
            <form className="admin-panel admin-form" onSubmit={savePortfolio}>
              <div>
                <span className="admin-kicker">{editingPortfolioSlug ? "Editar portfolio" : "Novo portfolio"}</span>
                <h1>{editingPortfolioSlug ? "Atualizar portfolio" : "Adicionar portfolio"}</h1>
              </div>
              <label>
                Titulo do portfolio
                <input value={portfolioForm.title} onChange={(event) => updatePortfolioField("title", event.target.value)} required />
              </label>
              <label>
                Categoria
                <input
                  list="portfolio-categories"
                  value={portfolioForm.type}
                  onChange={(event) => updatePortfolioField("type", event.target.value)}
                  placeholder="Website, Assistencia Tecnica, Hosting..."
                  required
                />
                <datalist id="portfolio-categories">
                  {categories.map((category) => <option key={category.slug} value={category.name} />)}
                </datalist>
              </label>
              <label>
                Link do trabalho opcional
                <input value={portfolioForm.href} onChange={(event) => updatePortfolioField("href", event.target.value)} type="url" placeholder="https://..." />
              </label>
              <label>
                Descricao
                <textarea value={portfolioForm.description} onChange={(event) => updatePortfolioField("description", event.target.value)} required />
              </label>
              <label>
                Imagens do trabalho
                <input accept="image/*" multiple onChange={(event) => setImageFiles(Array.from(event.target.files || []))} required={!portfolioForm.images && !imageFiles.length} type="file" />
              </label>
              <label>
                Logo relacionado
                <input accept="image/*" onChange={(event) => setPortfolioLogoFile(event.target.files?.[0] || null)} required={!portfolioForm.logo && !portfolioLogoFile} type="file" />
              </label>
              <div className="admin-actions">
                <button disabled={isSaving} type="submit">{isSaving ? "A guardar..." : editingPortfolioSlug ? "Guardar alteracoes" : "Adicionar portfolio"}</button>
                {editingPortfolioSlug ? <button className="admin-secondary" type="button" onClick={resetPortfolioForm}>Cancelar</button> : null}
              </div>
            </form>

            <aside className="admin-panel admin-preview">
              <span className="admin-kicker">Pre-visualizacao</span>
              <article className="portfolio-card portfolio-work-card">
                <div className="portfolio-template">
                  {currentPreview.images[0] ? <img src={currentPreview.images[0]} alt="" /> : null}
                  <div className="portfolio-image-caption">
                    <span>{portfolioForm.type || "Categoria"}</span>
                    <strong>{portfolioForm.title || "Titulo do portfolio"}</strong>
                  </div>
                </div>
                <div className="portfolio-work-body">
                  <span className="portfolio-work-type">{portfolioForm.type || "Categoria"}</span>
                  <h3>{portfolioForm.title || "Nome do projeto"}</h3>
                  <p>{portfolioForm.description || "A descricao preenchida aqui sera transformada num cartao igual aos cartoes do site."}</p>
                </div>
              </article>
            </aside>
          </section>

          <ContentList title={`${projects.length} portfolios`} items={projects.map((project) => ({
            key: project.slug,
            image: getProjectImages(project)[0],
            title: project.title,
            meta: project.type,
            description: project.description,
            onEdit: () => editProject(project),
            onDelete: canDelete ? () => deleteItem(project.title, `/api/admin/portfolio/${project.slug}`, loadProjects, () => editingPortfolioSlug === project.slug && resetPortfolioForm()) : undefined
          }))} />
        </>
      ) : null}

      {activeTab === "clients" ? (
        <>
          <section className="admin-grid admin-grid-single">
            <form className="admin-panel admin-form" onSubmit={saveClient}>
              <div>
                <span className="admin-kicker">{editingClientSlug ? "Editar cliente" : "Novo cliente"}</span>
                <h1>{editingClientSlug ? "Atualizar cliente" : "Adicionar cliente"}</h1>
              </div>
              <label>
                Nome do cliente
                <input value={clientForm.name} onChange={(event) => setClientForm((current) => ({ ...current, name: event.target.value }))} required />
              </label>
              <label>
                Link opcional
                <input value={clientForm.href} onChange={(event) => setClientForm((current) => ({ ...current, href: event.target.value }))} type="url" placeholder="https://..." />
              </label>
              <label>
                Logo do cliente
                <input accept="image/*" onChange={(event) => setClientLogoFile(event.target.files?.[0] || null)} required={!clientForm.logo && !clientLogoFile} type="file" />
              </label>
              <div className="admin-actions">
                <button disabled={isSaving} type="submit">{isSaving ? "A guardar..." : editingClientSlug ? "Guardar alteracoes" : "Adicionar cliente"}</button>
                {editingClientSlug ? <button className="admin-secondary" type="button" onClick={resetClientForm}>Cancelar</button> : null}
              </div>
            </form>
          </section>

          <ContentList title={`${clients.length} clientes`} items={clients.map((client) => ({
            key: client.slug,
            image: client.logo,
            title: client.name,
            meta: client.href || "Sem link",
            description: "Cliente visivel na seccao Clientes do website.",
            onEdit: () => editClient(client),
            onDelete: canDelete ? () => deleteItem(client.name, `/api/admin/clients/${client.slug}`, loadClients, () => editingClientSlug === client.slug && resetClientForm()) : undefined
          }))} />
        </>
      ) : null}

      {activeTab === "categories" ? (
        <>
          <section className="admin-grid admin-grid-single">
            <form className="admin-panel admin-form" onSubmit={saveCategory}>
              <div>
                <span className="admin-kicker">{editingCategorySlug ? "Editar categoria" : "Nova categoria"}</span>
                <h1>{editingCategorySlug ? "Atualizar categoria" : "Adicionar categoria"}</h1>
              </div>
              <label>
                Nome da categoria
                <input value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} required />
              </label>
              <label>
                Descricao
                <textarea value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} />
              </label>
              <div className="admin-actions">
                <button disabled={isSaving} type="submit">{isSaving ? "A guardar..." : editingCategorySlug ? "Guardar alteracoes" : "Adicionar categoria"}</button>
                {editingCategorySlug ? <button className="admin-secondary" type="button" onClick={resetCategoryForm}>Cancelar</button> : null}
              </div>
            </form>
          </section>

          <ContentList title={`${categories.length} categorias`} items={categories.map((category) => ({
            key: category.slug,
            title: category.name,
            meta: category.slug,
            description: category.description || "Sem descricao.",
            onEdit: () => editCategory(category),
            onDelete: canDelete ? () => deleteItem(category.name, `/api/admin/categories/${category.slug}`, loadCategories, () => editingCategorySlug === category.slug && resetCategoryForm()) : undefined
          }))} />
        </>
      ) : null}
    </main>
  );
}

function ContentList({
  title,
  items
}: {
  title: string;
  items: Array<{
    key: string;
    image?: string;
    title: string;
    meta: string;
    description: string;
    onEdit: () => void;
    onDelete?: () => void;
  }>;
}) {
  return (
    <section className="admin-panel admin-list">
      <div>
        <span className="admin-kicker">Conteudo publicado</span>
        <h2>{title}</h2>
      </div>
      <div className="admin-project-list">
        {items.map((item) => (
          <article className="admin-project-row" key={item.key}>
            {item.image ? <img src={item.image} alt="" /> : <div className="admin-row-placeholder" />}
            <div>
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
              <p>{item.description}</p>
            </div>
            <div className="admin-row-actions">
              <button type="button" onClick={item.onEdit}>Editar</button>
              {item.onDelete ? <button className="admin-danger" type="button" onClick={item.onDelete}>Remover</button> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
