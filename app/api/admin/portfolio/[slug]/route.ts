import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deletePortfolioProject, saveUploadedImage, saveUploadedImages, updatePortfolioProject } from "@/lib/portfolioStore";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const formData = await request.formData();
    const images = await saveUploadedImages(
      formData.getAll("imageFiles") as File[],
      parseImageList(String(formData.get("images") || formData.get("image") || ""))
    );
    const logo = await saveUploadedImage(formData.get("logoFile") as File | null, String(formData.get("logo") || ""));

    const project = await updatePortfolioProject(slug, {
      image: images[0] || "",
      images,
      logo,
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      type: String(formData.get("type") || ""),
      href: String(formData.get("href") || "")
    });

    if (!project) {
      return NextResponse.json({ message: "Portfólio não encontrado." }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Não foi possível guardar o portfólio." },
      { status: 400 }
    );
  }
}

function parseImageList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((image) => image.trim())
    .filter(Boolean);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { slug } = await context.params;
  const deleted = await deletePortfolioProject(slug);

  if (!deleted) {
    return NextResponse.json({ message: "Portfólio não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
