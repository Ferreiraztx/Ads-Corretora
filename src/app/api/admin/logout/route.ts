import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const resposta = NextResponse.json({ autenticado: false });
  resposta.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  return resposta;
}
