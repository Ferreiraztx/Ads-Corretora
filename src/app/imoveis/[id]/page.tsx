import Link from "next/link";
import { ArrowLeft, BedDouble, Bath, Maximize2, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Gallery from "./gallery";

const whatsapp = "https://wa.me/5541992371353";

export const dynamic = "force-dynamic";

export default async function ImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const imovel = await prisma.imovel.findUnique({ where: { id }, include: { fotos: { orderBy: { ordem: "asc" } } } });
  if (!imovel || !imovel.disponivel) notFound();
  const fotos = imovel.fotos.length ? imovel.fotos.map((foto) => foto.url) : [imovel.imagemUrl || "/imagens/imovel-placeholder.svg"];
  const preco = Number(imovel.preco) > 0 ? Number(imovel.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Consulte o valor";

  return <main className="detail-page">
    <header><div className="wrap nav"><Link href="/"><ArrowLeft size={17} /> Voltar para imóveis</Link><a className="navbtn" href={`${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel: ${imovel.titulo}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a></div></header>
    <div className="wrap detail-content">
      <Gallery fotos={fotos} titulo={imovel.titulo} />
      <div className="detail-info"><div><span className="detail-kicker">{imovel.tipo} · {imovel.cidade}/{imovel.estado}</span><h1>{imovel.titulo}</h1><p className="detail-price">{preco}</p></div><a className="btn gold detail-contact" href={`${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel: ${imovel.titulo}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Tenho interesse</a></div>
      <div className="detail-specs">{imovel.quartos != null && <span><BedDouble size={20} /><b>{imovel.quartos}</b> quartos</span>}{imovel.banheiros != null && <span><Bath size={20} /><b>{imovel.banheiros}</b> banheiros</span>}{imovel.area != null && <span><Maximize2 size={20} /><b>{imovel.area}</b> m²</span>}</div>
      {imovel.descricao && <section className="detail-description"><h2>Sobre o imóvel</h2><p>{imovel.descricao}</p></section>}
    </div>
  </main>;
}
