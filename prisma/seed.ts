import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.imovel.count();

  if (count > 0) return;

  await prisma.imovel.createMany({
    data: [
      { titulo: "Casa à venda", tipo: "Casa", cidade: "Curitiba", preco: 0, imagemUrl: "/imagens/imovel-placeholder.svg" },
      { titulo: "Sobrado à venda", tipo: "Sobrado", cidade: "Curitiba", preco: 0, imagemUrl: "/imagens/imovel-placeholder.svg" },
      { titulo: "Apartamento à venda", tipo: "Apartamento", cidade: "Curitiba", preco: 0, imagemUrl: "/imagens/imovel-placeholder.svg" },
    ],
  });
}

main().finally(() => prisma.$disconnect());
