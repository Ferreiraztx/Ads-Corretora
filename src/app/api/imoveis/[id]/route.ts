import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/admin-auth";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });
  const imovel = await prisma.imovel.findUnique({ where: { id }, include: { fotos: { orderBy: { ordem: "asc" } } } });
  if (!imovel) return NextResponse.json({ erro: "Imóvel não encontrado." }, { status: 404 });
  return NextResponse.json(imovel);
}

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
      destaque: dados.destaque === true,
      ordem: Number.isInteger(Number(dados.ordem)) ? Number(dados.ordem) : undefined,
    },
  });
  if (Array.isArray(dados.fotos)) {
    await prisma.fotoImovel.deleteMany({ where: { imovelId: id } });
    const fotos = dados.fotos.filter((foto: unknown): foto is string => typeof foto === "string" && foto.length > 0);
    if (fotos.length) await prisma.fotoImovel.createMany({ data: fotos.map((url: string, ordem: number) => ({ imovelId: id, url, ordem })) });
  }
  return NextResponse.json(await prisma.imovel.findUnique({ where: { id }, include: { fotos: { orderBy: { ordem: "asc" } } } }));
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });
  await prisma.imovel.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
