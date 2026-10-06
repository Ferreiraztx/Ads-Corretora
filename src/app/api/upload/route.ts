import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const tiposPermitidos = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (request.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  const dados = await request.formData();
  const arquivo = dados.get("file");
  if (!(arquivo instanceof File) || !tiposPermitidos.has(arquivo.type)) {
    return NextResponse.json({ erro: "Envie uma imagem JPG, PNG ou WebP." }, { status: 400 });
  }
  if (arquivo.size > 5 * 1024 * 1024) {
    return NextResponse.json({ erro: "A imagem deve ter no máximo 5 MB." }, { status: 400 });
  }

  const extensao = tiposPermitidos.get(arquivo.type);
  const nome = `${randomUUID()}.${extensao}`;
  const pasta = path.join(process.cwd(), "public", "uploads");
  await mkdir(pasta, { recursive: true });
  await writeFile(path.join(pasta, nome), Buffer.from(await arquivo.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${nome}` }, { status: 201 });
}
