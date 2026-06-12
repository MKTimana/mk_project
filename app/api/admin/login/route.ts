import { NextResponse } from "next/server";
import { isValidAdminLogin, setAdminSession } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { email = "", password = "" } = await request.json();

  if (!isValidAdminLogin(email, password)) {
    return NextResponse.json({ message: "Credenciais invalidas." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
