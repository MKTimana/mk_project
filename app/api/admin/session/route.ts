import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const user = await getAdminSession();
  return NextResponse.json({ authenticated: Boolean(user), user });
}
