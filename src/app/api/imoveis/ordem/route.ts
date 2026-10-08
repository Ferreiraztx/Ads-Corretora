import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const dados = await request.json();
  if (!Array.isArray(dados.ids) || dados.ids.some((id: unknown) => !Number.isInteger(Number(id)))) {
    return NextResponse.json({ erro: "Lista de imóveis inválida." }, { status: 400 });
  }

  await prisma.$transaction(
    dados.ids.map((id: number, ordem: number) =>
      prisma.imovel.update({ where: { id: Number(id) }, data: { ordem } }),
    ),
  );
  return NextResponse.json({ sucesso: true });
}
