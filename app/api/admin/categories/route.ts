import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createCategory, getCategories } from "@/lib/portfolioStore";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  return NextResponse.json(await getCategories());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const category = await createCategory({
      name: String(payload.name || ""),
      description: String(payload.description || "")
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Nao foi possivel guardar a categoria." },
      { status: 400 }
    );
  }
}
