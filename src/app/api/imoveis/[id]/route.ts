import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/admin-auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const id = Number((await context.params).id);
  const dados = await request.json();
  if (!Number.isInteger(id) || !dados.titulo || !dados.tipo || !dados.cidade || !Number.isFinite(Number(dados.preco))) {
    return NextResponse.json({ erro: "Dados do imóvel inválidos." }, { status: 400 });
  }
  const imovel = await prisma.imovel.update({
    where: { id },
    data: {
      titulo: String(dados.titulo), tipo: String(dados.tipo), cidade: String(dados.cidade),
      estado: String(dados.estado || "PR"), preco: Number(dados.preco), descricao: dados.descricao || null,
      quartos: dados.quartos ? Number(dados.quartos) : null, banheiros: dados.banheiros ? Number(dados.banheiros) : null,
      area: dados.area ? Number(dados.area) : null, imagemUrl: dados.imagemUrl || "/imagens/imovel-placeholder.svg",
      disponivel: dados.disponivel !== false,
    },
  });
  return NextResponse.json(imovel);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });
  await prisma.imovel.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
