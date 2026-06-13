import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createClient, getClients, saveUploadedImage } from "@/lib/portfolioStore";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  return NextResponse.json(await getClients());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const logo = await saveUploadedImage(formData.get("logoFile") as File | null, String(formData.get("logo") || ""));
    const client = await createClient({
      name: String(formData.get("name") || ""),
      logo,
      href: String(formData.get("href") || "")
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Nao foi possivel guardar o cliente." },
      { status: 400 }
    );
  }
}
