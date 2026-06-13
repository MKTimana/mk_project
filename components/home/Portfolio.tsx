"use client";

import { useState } from "react";
import type { PortfolioProject } from "@/data/site";
import { usePortfolioProjects } from "./usePortfolioProjects";

async function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function buildShareImage(project: PortfolioProject, accessUrl: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1200;
  canvas.height = 630;

  if (!ctx) {
    return null;
  }

  try {
    const photo = await loadCanvasImage(getProjectImages(project)[0]);
    const ratio = Math.max(canvas.width / photo.width, canvas.height / photo.height);
    const width = photo.width * ratio;
    const height = photo.height * ratio;
    ctx.drawImage(photo, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  } catch {
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#0f5f9d");
    gradient.addColorStop(0.55, "#168bd7");
    gradient.addColorStop(1, "#172033");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
  }

  const overlay = ctx.createLinearGradient(0, 0, 1200, 0);
  overlay.addColorStop(0, "rgba(15, 95, 157, 0.76)");
  overlay.addColorStop(0.62, "rgba(23, 32, 51, 0.34)");
  overlay.addColorStop(1, "rgba(23, 32, 51, 0.08)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.roundRect(72, 82, 650, 466, 32);
  ctx.fill();

  ctx.fillStyle = "#e9f6ff";
  ctx.roundRect(112, 122, 198, 42, 21);
  ctx.fill();

  ctx.fillStyle = "#0f5f9d";
  ctx.font = "800 20px Arial";
  ctx.fillText("Portfólio MKTECH", 132, 150);

  ctx.fillStyle = "#172033";
  ctx.font = "800 48px Arial";
  wrapCanvasText(ctx, project.title, 112, 230, 560, 58, 2);

  ctx.fillStyle = "#168bd7";
  ctx.font = "800 25px Arial";
  ctx.fillText(project.type, 112, 332, 560);

  ctx.fillStyle = "#657084";
  ctx.font = "400 27px Arial";
  wrapCanvasText(ctx, project.description, 112, 390, 548, 38, 3);

  ctx.fillStyle = "#e9f6ff";
  ctx.roundRect(112, 480, 170, 42, 21);
  ctx.fill();

  ctx.fillStyle = "#0f5f9d";
  ctx.font = "800 18px Arial";
  ctx.fillText("Aceder", 138, 507);

  ctx.fillStyle = "#172033";
  ctx.font = "700 20px Arial";
  wrapCanvasText(ctx, accessUrl, 306, 504, 360, 28, 2);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function getProjectImages(project: PortfolioProject) {
  return project.images?.length ? project.images : [project.image].filter(Boolean);
}

function getProjectServices(project: PortfolioProject) {
  return project.services?.length ? project.services : [project.type].filter(Boolean);
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  let lines = 1;

  words.forEach((word) => {
    const nextLine = `${line}${word} `;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = `${word} `;
      currentY += lineHeight;
      lines += 1;
      return;
    }

    if (lines <= maxLines) {
      line = nextLine;
    }
  });

  if (line && lines <= maxLines) {
    ctx.fillText(line.trim(), x, currentY);
  }
}

function downloadShareCard(blob: Blob, slug: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `mktech-${slug}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function Portfolio() {
  const portfolioProjects = usePortfolioProjects();
  const [galleryProject, setGalleryProject] = useState<PortfolioProject | null>(null);
  const galleryImages = galleryProject ? getProjectImages(galleryProject) : [];

  async function shareProject(project: PortfolioProject) {
    const portfolioUrl = `${window.location.origin}${window.location.pathname}#portfolio-${project.slug}`;
    const accessUrl = project.href || portfolioUrl;
    const shareText = `${project.description}\n\nAceder: ${accessUrl}`;
    const shareData = {
      title: `${project.title} | MKTECH`,
      text: shareText,
      url: accessUrl
    };

    try {
      const imageBlob = await buildShareImage(project, accessUrl);

      if (imageBlob) {
        const file = new File([imageBlob], `mktech-${project.slug}.png`, { type: "image/png" });
        const shareWithFile = { ...shareData, files: [file] };

        if (navigator.canShare?.(shareWithFile)) {
          await navigator.share(shareWithFile);
          return;
        }

        downloadShareCard(imageBlob, project.slug);
      }

      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareText);
    } catch {
      await navigator.clipboard.writeText(shareText);
    }
  }

  return (
    <section id="portfolio" className="portfolio portfolio-showcase">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <span className="section-kicker">Portfólio</span>
          <h2>Trabalhos realizados com foco em presença digital e suporte técnico.</h2>
          <p>
            Conheça alguns projetos entregues pela MKTECH, com soluções pensadas para reforçar a presença digital,
            a comunicação e a operação dos nossos clientes.
          </p>
        </div>

        <div className="row portfolio-container g-4" data-aos="fade-up" data-aos-delay="100">
          {portfolioProjects.map((project, index) => (
            <div className="col-xl-4 col-md-6 portfolio-item" key={project.slug}>
              <article id={`portfolio-${project.slug}`} className="portfolio-card portfolio-work-card">
                {project.href ? (
                <a className="portfolio-work-link" href={project.href} target="_blank" rel="noreferrer">
                  <div className={`portfolio-template portfolio-template-${(index % 3) + 1}`}>
                    <img src={getProjectImages(project)[0]} className="img-fluid" alt="" />
                    {getProjectImages(project).length > 1 ? (
                      <span className="portfolio-gallery-count">
                        <i className="bi bi-images" />
                        {getProjectImages(project).length}
                      </span>
                    ) : null}
                    <div className="portfolio-image-caption">
                      <span>{project.type}</span>
                      <strong>{project.title}</strong>
                    </div>
                  </div>
                </a>
                ) : (
                  <div className="portfolio-work-link">
                    <div className={`portfolio-template portfolio-template-${(index % 3) + 1}`}>
                      <img src={getProjectImages(project)[0]} className="img-fluid" alt="" />
                      {getProjectImages(project).length > 1 ? (
                        <span className="portfolio-gallery-count">
                          <i className="bi bi-images" />
                          {getProjectImages(project).length}
                        </span>
                      ) : null}
                      <div className="portfolio-image-caption">
                        <span>{project.type}</span>
                        <strong>{project.title}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="portfolio-work-body">
                  <span className="portfolio-work-type">{project.type}</span>
                  {project.href ? (
                    <h3>
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.title}
                    </a>
                    </h3>
                  ) : (
                    <h3>{project.title}</h3>
                  )}
                  {getProjectImages(project).length > 1 ? (
                    <button
                      type="button"
                      className="portfolio-description-button"
                      onClick={() => setGalleryProject(project)}
                    >
                      {project.description}
                    </button>
                  ) : (
                    <p>{project.description}</p>
                  )}
                  <div className="portfolio-service-list">
                    {getProjectServices(project).slice(0, 4).map((service) => (
                      <span className="portfolio-service-chip" key={service}>{service}</span>
                    ))}
                    {getProjectServices(project).length > 4 ? (
                      <span className="portfolio-service-chip">+{getProjectServices(project).length - 4}</span>
                    ) : null}
                  </div>
                </div>

                <div className="portfolio-work-actions">
                  {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer" className="portfolio-visit-link">
                    Ver trabalho
                  </a>
                  ) : null}
                  <button type="button" className="portfolio-share-button" onClick={() => shareProject(project)}>
                    <i className="bi bi-share" />
                    <span>Partilhar</span>
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {galleryProject ? (
        <div className="portfolio-gallery-modal" role="dialog" aria-modal="true" aria-label={galleryProject.title}>
          <button
            type="button"
            className="portfolio-gallery-backdrop"
            aria-label="Fechar galeria"
            onClick={() => setGalleryProject(null)}
          />
          <div className="portfolio-gallery-panel">
            <div className="portfolio-gallery-header">
              <div>
                <span>{galleryProject.type}</span>
                <h3>{galleryProject.title}</h3>
              </div>
              <button type="button" aria-label="Fechar galeria" onClick={() => setGalleryProject(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="portfolio-gallery-grid">
              {galleryImages.map((image, imageIndex) => (
                <figure key={`${image}-${imageIndex}`}>
                  <img src={image} alt={`${galleryProject.title} - imagem ${imageIndex + 1}`} />
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
