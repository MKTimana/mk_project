import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ClientLogo, PortfolioCategory, PortfolioProject } from "@/data/site";

const portfolioPath = path.join(process.cwd(), "data", "portfolio.json");
const clientsPath = path.join(process.cwd(), "data", "clients.json");
const categoriesPath = path.join(process.cwd(), "data", "categories.json");
const uploadDir = path.join(process.cwd(), "public", "assets", "img", "portfolio");
const cloudflareImagesVariant = process.env.CLOUDFLARE_IMAGES_VARIANT || "public";
const portfolioUploadProvider = process.env.PORTFOLIO_UPLOAD_PROVIDER || "r2";
const portfolioDataKey = process.env.PORTFOLIO_DATA_KEY || "data/portfolio.json";
const clientsDataKey = process.env.CLIENTS_DATA_KEY || "data/clients.json";
const categoriesDataKey = process.env.CATEGORIES_DATA_KEY || "data/categories.json";
const isReadOnlyRuntime = Boolean(process.env.VERCEL);

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
  const primaryImage = images[0] || project.image?.trim() || "";

  return {
    image: primaryImage,
    images: images.length ? images : [primaryImage],
    logo: project.logo?.trim() || "",
    title: project.title.trim(),
    description: project.description.trim(),
    type: project.type.trim(),
    href: project.href?.trim() || "",
    slug: project.slug.trim()
  };
}

function normalizeClient(client: ClientLogo): ClientLogo {
  return {
    name: client.name.trim(),
    logo: client.logo.trim(),
    href: client.href?.trim() || "",
    slug: client.slug.trim()
  };
}

function normalizeCategory(category: PortfolioCategory): PortfolioCategory {
  return {
    name: category.name.trim(),
    description: category.description?.trim() || "",
    slug: category.slug.trim()
  };
}

export async function getPortfolioProjects() {
  return getCollection(portfolioPath, portfolioDataKey, normalizeProject);
}

async function savePortfolioProjects(projects: PortfolioProject[]) {
  await saveCollection(portfolioPath, portfolioDataKey, projects);
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

async function getCollection<T>(localPath: string, r2Key: string, normalize: (item: T) => T) {
  if (hasCloudflareR2Config()) {
    const remoteItems = await getCollectionFromR2(r2Key, normalize);

    if (remoteItems) {
      return remoteItems;
    }
  }

  const content = await readFile(localPath, "utf8");
  return (JSON.parse(content) as T[]).map(normalize);
}

async function saveCollection<T>(localPath: string, r2Key: string, items: T[]) {
  if (hasCloudflareR2Config()) {
    await saveCollectionToR2(r2Key, items);
    return;
  }

  if (isReadOnlyRuntime) {
    throw new Error("Configure o Cloudflare R2 para guardar alterações em produção.");
  }

  await writeFile(localPath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

async function getCollectionFromR2<T>(r2Key: string, normalize: (item: T) => T) {
  try {
    const response = await getR2Client().send(
      new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET,
        Key: r2Key
      })
    );
    const content = await response.Body?.transformToString();

    if (!content) {
      return null;
    }

    return (JSON.parse(content) as T[]).map(normalize);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "";

    if (errorName === "NoSuchKey" || errorName === "NotFound") {
      return null;
    }

    throw error;
  }
}

async function saveCollectionToR2<T>(r2Key: string, items: T[]) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: r2Key,
      Body: `${JSON.stringify(items, null, 2)}\n`,
      ContentType: "application/json",
      CacheControl: "no-cache"
    })
  );
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
  if (isReadOnlyRuntime) {
    throw new Error("Configure Cloudflare R2 ou Cloudflare Images para guardar imagens em produção.");
  }

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

export async function getClients() {
  return getCollection(clientsPath, clientsDataKey, normalizeClient);
}

async function saveClients(clients: ClientLogo[]) {
  await saveCollection(clientsPath, clientsDataKey, clients);
}

export async function createClient(input: Omit<ClientLogo, "slug">) {
  const clients = await getClients();
  const client = normalizeClient({
    ...input,
    slug: uniqueSlug(input.name, clients.map((item) => ({ slug: item.slug } as PortfolioProject)))
  });

  clients.unshift(client);
  await saveClients(clients);

  return client;
}

export async function updateClient(slug: string, input: Omit<ClientLogo, "slug">) {
  const clients = await getClients();
  const index = clients.findIndex((client) => client.slug === slug);

  if (index === -1) {
    return null;
  }

  const client = normalizeClient({ ...input, slug });
  clients[index] = client;
  await saveClients(clients);

  return client;
}

export async function deleteClient(slug: string) {
  const clients = await getClients();
  const nextClients = clients.filter((client) => client.slug !== slug);

  if (nextClients.length === clients.length) {
    return false;
  }

  await saveClients(nextClients);
  return true;
}

export async function getCategories() {
  return getCollection(categoriesPath, categoriesDataKey, normalizeCategory);
}

async function saveCategories(categories: PortfolioCategory[]) {
  await saveCollection(categoriesPath, categoriesDataKey, categories);
}

export async function createCategory(input: Omit<PortfolioCategory, "slug">) {
  const categories = await getCategories();
  const category = normalizeCategory({
    ...input,
    slug: uniqueSlug(input.name, categories.map((item) => ({ slug: item.slug } as PortfolioProject)))
  });

  categories.unshift(category);
  await saveCategories(categories);

  return category;
}

export async function updateCategory(slug: string, input: Omit<PortfolioCategory, "slug">) {
  const categories = await getCategories();
  const index = categories.findIndex((category) => category.slug === slug);

  if (index === -1) {
    return null;
  }

  const category = normalizeCategory({ ...input, slug });
  categories[index] = category;
  await saveCategories(categories);

  return category;
}

export async function deleteCategory(slug: string) {
  const categories = await getCategories();
  const nextCategories = categories.filter((category) => category.slug !== slug);

  if (nextCategories.length === categories.length) {
    return false;
  }

  await saveCategories(nextCategories);
  return true;
}
