import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const dados = await request.json();
  if (!dados.nome || !dados.telefone) {
    return NextResponse.json({ erro: "Nome e telefone são obrigatórios." }, { status: 400 });
  }
  const interessado = await prisma.interessado.create({
    data: { nome: String(dados.nome), telefone: String(dados.telefone), email: dados.email || null, mensagem: dados.mensagem || null, imovelId: dados.imovelId ? Number(dados.imovelId) : null },
  });
  return NextResponse.json({ id: interessado.id }, { status: 201 });
}
