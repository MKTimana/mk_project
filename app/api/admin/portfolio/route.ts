import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createPortfolioProject, getPortfolioProjects, saveUploadedImage, saveUploadedImages } from "@/lib/portfolioStore";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  return NextResponse.json(await getPortfolioProjects());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const images = await saveUploadedImages(
      formData.getAll("imageFiles") as File[],
      parseImageList(String(formData.get("images") || formData.get("image") || ""))
    );
    const logo = await saveUploadedImage(formData.get("logoFile") as File | null, String(formData.get("logo") || ""));

    const project = await createPortfolioProject({
      image: images[0] || "",
      images,
      logo,
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      type: String(formData.get("type") || ""),
      services: parseImageList(String(formData.get("services") || "")),
      href: String(formData.get("href") || "")
    });

    return NextResponse.json(project, { status: 201 });
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
