import { NextResponse } from "next/server";
import { getClients } from "@/lib/portfolioStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getClients());
}
