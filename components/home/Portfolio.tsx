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

async function buildShareImage(project: PortfolioProject, _accessUrl: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1350;

  if (!ctx) {
    return null;
  }

  const background = ctx.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#edf6fc");
  background.addColorStop(0.52, "#ffffff");
  background.addColorStop(1, "#f5f8fb");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = "#0f5f9d";
  ctx.fillRect(0, 0, 1080, 18);

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(23, 32, 51, 0.16)";
  ctx.shadowBlur = 42;
  ctx.shadowOffsetY = 22;
  ctx.roundRect(100, 84, 880, 1178, 30);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = "#f5f8fb";
  ctx.roundRect(132, 118, 816, 520, 28);
  ctx.fill();

  try {
    const photo = await loadCanvasImage(getProjectImages(project)[0]);
    drawCoverImage(ctx, photo, 132, 118, 816, 520, 28);
  } catch {
    const gradient = ctx.createLinearGradient(132, 118, 948, 638);
    gradient.addColorStop(0, "#0f5f9d");
    gradient.addColorStop(0.7, "#168bd7");
    gradient.addColorStop(1, "#172033");
    ctx.fillStyle = gradient;
    ctx.roundRect(132, 118, 816, 520, 28);
    ctx.fill();
  }

  const imageOverlay = ctx.createLinearGradient(132, 638, 132, 330);
  imageOverlay.addColorStop(0, "rgba(23, 32, 51, 0.92)");
  imageOverlay.addColorStop(0.62, "rgba(23, 32, 51, 0.38)");
  imageOverlay.addColorStop(1, "rgba(23, 32, 51, 0)");
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(132, 118, 816, 520, 28);
  ctx.clip();
  ctx.fillStyle = imageOverlay;
  ctx.fillRect(132, 118, 816, 520);
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.roundRect(164, 458, 300, 44, 22);
  ctx.fill();

  ctx.fillStyle = "#0f5f9d";
  ctx.font = "800 21px Arial";
  ctx.fillText(project.type.toUpperCase(), 188, 487, 250);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 50px Arial";
  wrapCanvasText(ctx, project.title, 164, 555, 720, 56, 2);

  ctx.fillStyle = "#168bd7";
  ctx.font = "800 24px Arial";
  ctx.fillText(project.type.toUpperCase(), 150, 720, 700);

  ctx.fillStyle = "#172033";
  ctx.font = "800 40px Arial";
  wrapCanvasText(ctx, project.title, 150, 790, 760, 48, 2);

  ctx.fillStyle = "#657084";
  ctx.font = "400 32px Arial";
  wrapCanvasText(ctx, project.description, 150, 910, 760, 46, 4);

  drawServiceChips(ctx, getProjectServices(project), 150, 1096, 760);

  ctx.strokeStyle = "#d7ecfa";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 1242);
  ctx.lineTo(930, 1242);
  ctx.stroke();

  ctx.fillStyle = "#0f5f9d";
  ctx.font = "800 24px Arial";
  ctx.fillText("MKTECH", 150, 1292);

  ctx.fillStyle = "#657084";
  ctx.font = "500 21px Arial";
  ctx.fillText("Soluções digitais, suporte técnico e presença online", 272, 1292, 620);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function getProjectImages(project: PortfolioProject) {
  return project.images?.length ? project.images : [project.image].filter(Boolean);
}

function getProjectServices(project: PortfolioProject) {
  return project.services?.length ? project.services : [project.type].filter(Boolean);
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const ratio = Math.max(width / image.width, height / image.height);
  const imageWidth = image.width * ratio;
  const imageHeight = image.height * ratio;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(image, x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight);
  ctx.restore();
}

function drawServiceChips(ctx: CanvasRenderingContext2D, services: string[], x: number, y: number, maxWidth: number) {
  let currentX = x;
  let currentY = y;

  services.slice(0, 4).forEach((service) => {
    ctx.font = "800 20px Arial";
    const chipWidth = Math.min(ctx.measureText(service).width + 34, maxWidth);

    if (currentX + chipWidth > x + maxWidth) {
      currentX = x;
      currentY += 46;
    }

    ctx.fillStyle = "#eef7fd";
    ctx.roundRect(currentX, currentY, chipWidth, 38, 19);
    ctx.fill();
    ctx.fillStyle = "#0f5f9d";
    ctx.fillText(service, currentX + 17, currentY + 26, chipWidth - 34);
    currentX += chipWidth + 12;
  });
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
    const shareText = [
      `${project.title} | MKTECH`,
      project.description,
      "",
      `Serviços: ${getProjectServices(project).join(", ")}`,
      `Link de acesso: ${accessUrl}`
    ].join("\n");
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
                      <span className="portfolio-service-chip" key={service}>
                        {service}
                      </span>
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
