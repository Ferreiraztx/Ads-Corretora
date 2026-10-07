import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const dados = await request.json().catch(() => ({}));
  const username = String(dados.username || "").trim();
  const password = String(dados.password || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";

  if (username !== expectedUsername || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ erro: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const resposta = NextResponse.json({ autenticado: true, username });
  resposta.cookies.set(ADMIN_COOKIE, createSession(username), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, path: "/",
  });
  return resposta;
}
