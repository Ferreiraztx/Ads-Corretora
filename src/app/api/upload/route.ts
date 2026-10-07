import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  const dados = await request.formData();
  const arquivo = dados.get("file");
  if (!(arquivo instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
    return NextResponse.json({ erro: "Envie uma imagem JPG, PNG ou WebP." }, { status: 400 });
  }
  if (arquivo.size > 5 * 1024 * 1024) {
    return NextResponse.json({ erro: "A imagem deve ter no máximo 5 MB." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ erro: "O armazenamento de fotos ainda não foi configurado na Vercel." }, { status: 503 });
  }

  const blob = await put(`imoveis/${crypto.randomUUID()}-${arquivo.name}`, arquivo, {
    access: "public",
    addRandomSuffix: false,
  });
  return NextResponse.json({ url: blob.url }, { status: 201 });
}
