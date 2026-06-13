import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || (!url.startsWith("https://") && !url.startsWith("http://"))) {
    return NextResponse.json({ message: "URL de imagem inválida." }, { status: 400 });
  }

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json({ message: "Não foi possível carregar a imagem." }, { status: 400 });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType
    }
  });
}
