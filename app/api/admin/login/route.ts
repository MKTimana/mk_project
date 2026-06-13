import { NextResponse } from "next/server";
import { setAdminSession, validateAdminLogin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { email = "", password = "" } = await request.json();
  const user = validateAdminLogin(email, password);

  if (!user) {
    return NextResponse.json({ message: "Credenciais invalidas." }, { status: 401 });
  }

  await setAdminSession(user);
  return NextResponse.json({ ok: true, user });
}
