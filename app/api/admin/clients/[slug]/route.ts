import { NextResponse } from "next/server";
import { canDeleteContent, isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteClient, saveUploadedImage, updateClient } from "@/lib/portfolioStore";

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
    const logo = await saveUploadedImage(formData.get("logoFile") as File | null, String(formData.get("logo") || ""));
    const client = await updateClient(slug, {
      name: String(formData.get("name") || ""),
      logo,
      href: String(formData.get("href") || "")
    });

    if (!client) {
      return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Não foi possível guardar o cliente." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  if (!(await canDeleteContent())) {
    return NextResponse.json({ message: "Apenas administradores podem apagar conteúdo." }, { status: 403 });
  }

  const { slug } = await context.params;
  const deleted = await deleteClient(slug);

  if (!deleted) {
    return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
