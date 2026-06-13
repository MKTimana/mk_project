import { NextResponse } from "next/server";
import { canDeleteContent, isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteCategory, updateCategory } from "@/lib/portfolioStore";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const payload = await request.json();
    const category = await updateCategory(slug, {
      name: String(payload.name || ""),
      description: String(payload.description || "")
    });

    if (!category) {
      return NextResponse.json({ message: "Categoria nao encontrada." }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Nao foi possivel guardar a categoria." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  if (!(await canDeleteContent())) {
    return NextResponse.json({ message: "Apenas administradores podem apagar conteudo." }, { status: 403 });
  }

  const { slug } = await context.params;
  const deleted = await deleteCategory(slug);

  if (!deleted) {
    return NextResponse.json({ message: "Categoria nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
