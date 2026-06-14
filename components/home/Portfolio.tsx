"use client";

import { useState } from "react";
import type { PortfolioProject } from "@/data/site";
import { usePortfolioProjects } from "./usePortfolioProjects";

async function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    if (!src) {
      reject(new Error("Imagem ausente."));
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = getCanvasImageSource(src);
  });
}

function getCanvasImageSource(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }

  return src;
}

async function buildShareImage(project: PortfolioProject, _accessUrl: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 760;
  canvas.height = 1000;

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 760, 1000);

  fillRoundRect(ctx, 16, 16, 728, 968, 26, "#ffffff");
  strokeRoundRect(ctx, 16, 16, 728, 968, 26, "#bde3fb", 2);

  fillRoundRect(ctx, 16, 16, 728, 430, 26, "#172033");

  ctx.strokeStyle = "#bde3fb";
  ctx.lineWidth = 2;

  try {
    const photo = await loadCanvasImage(getProjectImages(project)[0]);
    drawTopCoverImage(ctx, photo, 16, 16, 728, 430, 26);
  } catch {
    const gradient = ctx.createLinearGradient(16, 16, 744, 446);
    gradient.addColorStop(0, "#0f5f9d");
    gradient.addColorStop(0.7, "#168bd7");
    gradient.addColorStop(1, "#172033");
    fillTopRoundRect(ctx, 16, 16, 728, 430, 26, gradient);
  }

  const imageOverlay = ctx.createLinearGradient(16, 446, 16, 210);
  imageOverlay.addColorStop(0, "rgba(23, 32, 51, 0.92)");
  imageOverlay.addColorStop(0.62, "rgba(23, 32, 51, 0.38)");
  imageOverlay.addColorStop(1, "rgba(23, 32, 51, 0)");
  fillTopRoundRect(ctx, 16, 16, 728, 430, 26, imageOverlay);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 26px Arial";
  ctx.fillText(project.type.toUpperCase(), 54, 345, 640);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 40px Arial";
  wrapCanvasText(ctx, project.title, 54, 396, 650, 46, 2);

  ctx.fillStyle = "#168bd7";
  ctx.font = "800 27px Arial";
  ctx.fillText(project.type.toUpperCase(), 62, 525, 620);

  ctx.fillStyle = "#172033";
  ctx.font = "800 34px Arial";
  wrapCanvasText(ctx, project.title, 62, 595, 620, 42, 2);

  ctx.fillStyle = "#657084";
  ctx.font = "400 31px Arial";
  wrapCanvasText(ctx, project.description, 62, 705, 620, 42, 4);

  drawServiceChips(ctx, getProjectServices(project), 62, 865, 620);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function getProjectImages(project: PortfolioProject) {
  return project.images?.length ? project.images : [project.image].filter(Boolean);
}

function getProjectServices(project: PortfolioProject) {
  return project.services?.length ? project.services : [project.type].filter(Boolean);
}

function hasProjectLogo(project: PortfolioProject) {
  return Boolean(project.logo?.trim());
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function fillTopRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function drawTopCoverImage(
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
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight);
  ctx.restore();
}

function drawServiceChips(ctx: CanvasRenderingContext2D, services: string[], x: number, y: number, maxWidth: number) {
  let currentX = x;
  let currentY = y;

  services.slice(0, 4).forEach((service) => {
    ctx.font = "800 22px Arial";
    const chipWidth = Math.min(ctx.measureText(service).width + 36, maxWidth);

    if (currentX + chipWidth > x + maxWidth) {
      currentX = x;
      currentY += 56;
    }

    fillRoundRect(ctx, currentX, currentY, chipWidth, 44, 22, "#eef7fd");
    strokeRoundRect(ctx, currentX, currentY, chipWidth, 44, 22, "#bde3fb", 1.5);
    ctx.fillStyle = "#0f5f9d";
    ctx.fillText(service, currentX + 18, currentY + 30, chipWidth - 36);
    currentX += chipWidth + 14;
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
      `Serviços: ${getProjectServices(project).join(", ")}`
    ].join("\n");
    const fallbackShareText = `${shareText}\n${accessUrl}`;
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

      await navigator.clipboard.writeText(fallbackShareText);
    } catch {
      await navigator.clipboard.writeText(fallbackShareText);
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
                      {hasProjectLogo(project) ? (
                        <span className="portfolio-client-logo">
                          <img src={project.logo} alt={`${project.title} logo`} />
                        </span>
                      ) : null}
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
                      {hasProjectLogo(project) ? (
                        <span className="portfolio-client-logo">
                          <img src={project.logo} alt={`${project.title} logo`} />
                        </span>
                      ) : null}
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
