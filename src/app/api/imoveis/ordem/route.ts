import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const dados = await request.json();
  if (!Array.isArray(dados.ids) || dados.ids.length === 0 || dados.ids.some((id: unknown) => !Number.isInteger(Number(id)))) {
    return NextResponse.json({ erro: "Lista de imóveis inválida." }, { status: 400 });
  }

  const ids = dados.ids.map((id: unknown) => Number(id));
  if (new Set(ids).size !== ids.length) {
    return NextResponse.json({ erro: "A lista de imóveis não pode conter itens repetidos." }, { status: 400 });
  }

  const existentes = await prisma.imovel.count({ where: { id: { in: ids } } });
  if (existentes !== ids.length) {
    return NextResponse.json({ erro: "Um ou mais imóveis não foram encontrados." }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id: number, ordem: number) =>
      prisma.imovel.update({ where: { id }, data: { ordem } }),
    ),
  );
  return NextResponse.json({ sucesso: true });
}
