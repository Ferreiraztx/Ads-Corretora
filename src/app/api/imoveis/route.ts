import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/admin-auth";

function dadosValidos(dados: Record<string, unknown>) {
  return Boolean(dados.titulo && dados.tipo && dados.cidade && dados.preco !== undefined && Number.isFinite(Number(dados.preco)));
}

export async function GET() {
  const imoveis = await prisma.imovel.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(imoveis);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const dados = await request.json();
  if (!dadosValidos(dados)) {
    return NextResponse.json({ erro: "Título, tipo, cidade e preço são obrigatórios." }, { status: 400 });
  }
  const imovel = await prisma.imovel.create({
    data: {
      titulo: String(dados.titulo), tipo: String(dados.tipo), cidade: String(dados.cidade),
      estado: String(dados.estado || "PR"), preco: Number(dados.preco), descricao: dados.descricao || null,
      quartos: dados.quartos ? Number(dados.quartos) : null, banheiros: dados.banheiros ? Number(dados.banheiros) : null,
      area: dados.area ? Number(dados.area) : null, imagemUrl: dados.imagemUrl || "/imagens/imovel-placeholder.svg",
    },
  });
  return NextResponse.json(imovel, { status: 201 });
}
