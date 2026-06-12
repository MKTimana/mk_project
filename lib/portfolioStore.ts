import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { PortfolioProject } from "@/data/site";

const portfolioPath = path.join(process.cwd(), "data", "portfolio.json");
const uploadDir = path.join(process.cwd(), "public", "assets", "img", "portfolio");
const cloudflareImagesVariant = process.env.CLOUDFLARE_IMAGES_VARIANT || "public";
const portfolioUploadProvider = process.env.PORTFOLIO_UPLOAD_PROVIDER || "r2";

type CloudflareImagesResponse = {
  success: boolean;
  errors?: { message?: string }[];
  result?: {
    id?: string;
    variants?: string[];
  };
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function uniqueSlug(title: string, projects: PortfolioProject[], currentSlug?: string) {
  const base = slugify(title) || "portfolio";
  let slug = currentSlug || base;
  let count = 2;

  while (projects.some((project) => project.slug === slug && project.slug !== currentSlug)) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
}

function normalizeProject(project: PortfolioProject): PortfolioProject {
  const images = (project.images?.length ? project.images : [project.image])
    .map((image) => image.trim())
    .filter(Boolean);
  const primaryImage = images[0] || project.image.trim();

  return {
    image: primaryImage,
    images: images.length ? images : [primaryImage],
    logo: project.logo.trim(),
    title: project.title.trim(),
    description: project.description.trim(),
    type: project.type.trim(),
    href: project.href.trim(),
    slug: project.slug.trim()
  };
}

export async function getPortfolioProjects() {
  const content = await readFile(portfolioPath, "utf8");
  return (JSON.parse(content) as PortfolioProject[]).map(normalizeProject);
}

async function savePortfolioProjects(projects: PortfolioProject[]) {
  await writeFile(portfolioPath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

function hasCloudflareImagesConfig() {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_IMAGES_TOKEN && cloudflareImagesVariant);
}

function hasCloudflareR2Config() {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET &&
      process.env.CLOUDFLARE_R2_PUBLIC_URL
  );
}

function getCloudflareImageUrl(imageId: string, variants: string[] = []) {
  const preferredVariant = variants.find((variant) => variant.endsWith(`/${cloudflareImagesVariant}`));

  if (preferredVariant) {
    return preferredVariant;
  }

  if (variants[0]) {
    return variants[0];
  }

  if (!process.env.CLOUDFLARE_IMAGES_DELIVERY_HASH) {
    throw new Error("Cloudflare Images não devolveu uma URL pública e CLOUDFLARE_IMAGES_DELIVERY_HASH não está definido.");
  }

  return `https://imagedelivery.net/${process.env.CLOUDFLARE_IMAGES_DELIVERY_HASH}/${imageId}/${cloudflareImagesVariant}`;
}

async function uploadImageToCloudflare(file: File) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_IMAGES_TOKEN;

  if (!accountId || !token) {
    throw new Error("Cloudflare Images não está configurado.");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  const data = (await response.json()) as CloudflareImagesResponse;

  if (!response.ok || !data.success || !data.result?.id) {
    const message = data.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new Error(message || "Não foi possível enviar a imagem para o Cloudflare.");
  }

  return getCloudflareImageUrl(data.result.id, data.result.variants);
}

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ""
    }
  });
}

async function uploadImageToR2(file: File) {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, "");

  if (!bucket || !publicUrl) {
    throw new Error("Cloudflare R2 não está configurado.");
  }

  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const fileBaseName = slugify(file.name.replace(extension, "")) || "imagem";
  const key = `portfolio/${Date.now()}-${fileBaseName}${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return `${publicUrl}/${key}`;
}

async function saveUploadedImageLocally(file: File) {
  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const safeName = `${Date.now()}-${slugify(file.name.replace(extension, "")) || "imagem"}${extension}`;
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()));

  return `/assets/img/portfolio/${safeName}`;
}

export async function saveUploadedImage(file: File | null, fallback = "") {
  if (!file || file.size === 0) {
    return fallback;
  }

  if (portfolioUploadProvider === "r2" && hasCloudflareR2Config()) {
    return uploadImageToR2(file);
  }

  if (portfolioUploadProvider === "images" && hasCloudflareImagesConfig()) {
    return uploadImageToCloudflare(file);
  }

  return saveUploadedImageLocally(file);
}

export async function saveUploadedImages(files: File[], fallbackImages: string[] = []) {
  const uploadedImages = await Promise.all(files.map((file) => saveUploadedImage(file, "")));
  return [...fallbackImages, ...uploadedImages].map((image) => image.trim()).filter(Boolean);
}

export async function createPortfolioProject(input: Omit<PortfolioProject, "slug">) {
  const projects = await getPortfolioProjects();
  const project = normalizeProject({
    ...input,
    slug: uniqueSlug(input.title, projects)
  });

  projects.unshift(project);
  await savePortfolioProjects(projects);

  return project;
}

export async function updatePortfolioProject(slug: string, input: Omit<PortfolioProject, "slug">) {
  const projects = await getPortfolioProjects();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return null;
  }

  const project = normalizeProject({
    ...input,
    slug
  });

  projects[index] = project;
  await savePortfolioProjects(projects);

  return project;
}

export async function deletePortfolioProject(slug: string) {
  const projects = await getPortfolioProjects();
  const nextProjects = projects.filter((project) => project.slug !== slug);

  if (nextProjects.length === projects.length) {
    return false;
  }

  await savePortfolioProjects(nextProjects);
  return true;
}
