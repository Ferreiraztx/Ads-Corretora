import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContatoForm } from "./ContatoForm";

const whatsapp = "https://wa.me/5541992371353";

export default async function Home() {
  const imoveis = await prisma.imovel.findMany({ where: { disponivel: true }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <header><div className="wrap nav"><Link href="#inicio"><Image className="logo" src="/imagens/logo.png" alt="Andréia Corretora" width={72} height={72} /></Link><nav><Link href="#imoveis">Imóveis</Link><Link href="#sobre">Sobre</Link><Link href="#financiamento">Financiamento</Link><a className="navbtn" href={whatsapp}>WhatsApp</a></nav></div></header>
      <main id="inicio">
        <section className="hero"><Image className="cover" src="/imagens/capa.jpg" alt="Andréia Corretora de Imóveis — Curitiba e Região" width={1600} height={608} priority /><div className="actions"><Link className="btn gold" href="#imoveis">🏠 VER IMÓVEIS</Link><a className="btn white" href={whatsapp}>💬 FALAR NO WHATSAPP</a></div></section>
        <section id="imoveis"><div className="wrap"><div className="title"><h2>Imóveis em Destaque</h2><p>Encontre seu próximo imóvel em Curitiba e Região.</p></div><div className="cards">
          {imoveis.length === 0 ? <p>Nenhum imóvel disponível no momento.</p> : imoveis.map((imovel) => <article className="card" key={imovel.id}><div className="photo"><Image src={imovel.imagemUrl || "/imagens/imovel-placeholder.svg"} alt={imovel.titulo} fill sizes="(max-width: 800px) 92vw, 350px" /></div><div className="body"><h3>{imovel.titulo}</h3><p>{imovel.cidade}/{imovel.estado}</p><div className="price">{Number(imovel.preco) > 0 ? Number(imovel.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Consulte o valor"}</div><a className="btn gold" href={`${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel: ${imovel.titulo}`)}`}>Tenho interesse</a></div></article>)}
        </div></div></section>
        <section className="about" id="sobre"><div className="wrap aboutgrid"><div><Image className="aboutimg" src="/imagens/logo.png" alt="Logo Andréia" width={260} height={260} /></div><div><h2>Sobre Andréia</h2><p>Sou Andréia, Corretora de Imóveis, e meu objetivo é ajudar você a encontrar o imóvel ideal com segurança, transparência e atendimento personalizado.</p><p>Atuo em Curitiba e Região, auxiliando clientes na compra e venda de imóveis.</p><div className="features"><div className="feature"><strong>Atendimento</strong>Próximo e personalizado</div><div className="feature"><strong>Segurança</strong>Orientação em cada etapa</div><div className="feature"><strong>Confiança</strong>Transparência nos negócios</div></div></div></div></section>
        <section id="financiamento"><div className="wrap"><div className="title"><h2>Financiamento imobiliário</h2><p>Orientação para você entender melhor o processo de compra.</p></div><div className="features"><div className="feature"><strong>💰 Financiamento</strong>Conheça as possibilidades para comprar seu imóvel.</div><div className="feature"><strong>🏦 FGTS</strong>Entenda como o FGTS pode participar da negociação.</div><div className="feature"><strong>📄 Documentação</strong>Orientação sobre os próximos passos.</div></div></div></section>
        <section className="contact" id="contato"><div className="wrap contactgrid"><div><h2>Vamos encontrar seu próximo imóvel?</h2><p>Conte o que você procura e fale diretamente comigo.</p><a className="whats" href={whatsapp}>💬 Falar pelo WhatsApp</a></div><div><div className="contactbox"><strong>Andréia | Corretora de Imóveis</strong><p>CRECI-PR F 58517</p><p>📍 Curitiba e Região</p><p>📱 (41) 99237-1353</p><p>📸 @ads.corretora</p></div><ContatoForm /></div></div></section>
      </main>
      <footer>© 2026 Andréia Corretora de Imóveis • CRECI-PR F 58517</footer>
    </>
  );
}
