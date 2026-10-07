"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Building2, CheckCircle2, ExternalLink, ImagePlus, LogOut, MessageCircle, Pencil, Plus, Trash2, X } from "lucide-react";

type Imovel = {
  id: number; titulo: string; tipo: string; cidade: string; estado: string;
  descricao: string | null; preco: string | number; quartos: number | null;
  banheiros: number | null; area: number | null; imagemUrl: string | null; disponivel: boolean;
};
type Formulario = Omit<Imovel, "id" | "preco" | "imagemUrl" | "disponivel"> & {
  preco: string; imagemUrl: string; disponivel: boolean;
};

const vazio: Formulario = {
  titulo: "", tipo: "Casa", cidade: "Curitiba", estado: "PR", descricao: "",
  preco: "", quartos: null, banheiros: null, area: null,
  imagemUrl: "/imagens/imovel-placeholder.svg", disponivel: true,
};
const whatsapp = "https://wa.me/5541992371353";

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault(); setCarregando(true); setErro("");
    const resposta = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) setErro(dados.erro || "Não foi possível entrar.");
    else onSuccess();
    setCarregando(false);
  }

  return <main className="admin-login"><div className="login-card"><div className="login-mark"><Building2 size={28} /></div><span className="admin-kicker">ÁREA RESTRITA</span><h1>Acessar painel</h1><p>Gerencie os imóveis da Andréia Corretora.</p><form onSubmit={entrar}><label>Usuário<input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" /></label><label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label><button className="btn gold form-submit" disabled={carregando}>{carregando ? "Entrando..." : "Entrar no painel"}</button>{erro && <p className="admin-error" role="alert">{erro}</p>}</form><a className="login-site-link" href="/">← Voltar para o site</a></div></main>;
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [form, setForm] = useState<Formulario>(vazio);
  const [editando, setEditando] = useState<number | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    const resposta = await fetch("/api/imoveis", { cache: "no-store" });
    if (resposta.ok) setImoveis(await resposta.json());
    else if (resposta.status === 401) setAutenticado(false);
  }
  useEffect(() => { fetch("/api/admin/session").then((r) => r.json()).then((d) => { setAutenticado(d.autenticado); if (d.autenticado) carregar(); }); }, []);

  function alterar<K extends keyof Formulario>(campo: K, valor: Formulario[K]) { setForm((atual) => ({ ...atual, [campo]: valor })); }
  function selecionarArquivo(event: ChangeEvent<HTMLInputElement>) { const novo = event.target.files?.[0] ?? null; setArquivo(novo); if (novo) setPreview(URL.createObjectURL(novo)); }
  function iniciarEdicao(imovel: Imovel) {
    setEditando(imovel.id); setArquivo(null); setPreview(imovel.imagemUrl || "");
    setForm({ titulo: imovel.titulo, tipo: imovel.tipo, cidade: imovel.cidade, estado: imovel.estado, descricao: imovel.descricao || "", preco: String(Number(imovel.preco)), quartos: imovel.quartos, banheiros: imovel.banheiros, area: imovel.area, imagemUrl: imovel.imagemUrl || "/imagens/imovel-placeholder.svg", disponivel: imovel.disponivel });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function limparFormulario() { setForm(vazio); setEditando(null); setArquivo(null); setPreview(""); }
  async function enviarImagem() {
    if (!arquivo) return form.imagemUrl;
    const dados = new FormData(); dados.append("file", arquivo);
    const resposta = await fetch("/api/upload", { method: "POST", body: dados });
    const resultado = await resposta.json().catch(() => null) as { erro?: string; url?: string } | null;
    if (!resposta.ok || !resultado?.url) throw new Error(resultado?.erro || "Não foi possível enviar a imagem.");
    return resultado.url;
  }
  async function salvar(event: FormEvent) {
    event.preventDefault(); setCarregando(true); setMensagem("");
    try {
      const resposta = await fetch(editando ? `/api/imoveis/${editando}` : "/api/imoveis", { method: editando ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, imagemUrl: await enviarImagem(), preco: Number(form.preco) }) });
      const resultado = await resposta.json().catch(() => null) as { erro?: string } | null;
      if (!resposta.ok) throw new Error(resultado?.erro || "Não foi possível salvar o imóvel.");
      setMensagem(editando ? "Imóvel atualizado com sucesso." : "Imóvel cadastrado com sucesso."); limparFormulario(); carregar();
    } catch (erro) { setMensagem(erro instanceof Error ? erro.message : "Não foi possível salvar o imóvel."); } finally { setCarregando(false); }
  }
  async function remover(id: number) {
    if (!window.confirm("Deseja remover este imóvel?")) return;
    const resposta = await fetch(`/api/imoveis/${id}`, { method: "DELETE" });
    if (resposta.ok) { setMensagem("Imóvel removido."); carregar(); } else setMensagem("Não foi possível remover o imóvel.");
  }
  async function sair() { await fetch("/api/admin/logout", { method: "POST" }); setAutenticado(false); }

  if (autenticado === null) return <main className="admin-loading">Carregando painel...</main>;
  if (!autenticado) return <Login onSuccess={() => { setAutenticado(true); carregar(); }} />;

  return <main className="admin-shell">
    <header className="admin-header"><div className="admin-header-inner"><div className="brand-admin"><div className="brand-icon"><Building2 size={21} /></div><div><span className="admin-eyebrow">ÁREA RESTRITA</span><h1>Painel de imóveis</h1></div></div><div className="admin-header-actions"><a className="admin-back" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Ver site</a><button className="logout-button" onClick={sair}><LogOut size={15} /> Sair</button></div></div></header>
    <div className="admin wrap">
      <section className="admin-intro"><div><p className="admin-kicker">Gestão do catálogo</p><h2>Olá, Andréia</h2><p>Cadastre e mantenha seus anúncios sempre atualizados.</p></div><div className="admin-stat"><strong>{imoveis.length}</strong><span>imóveis cadastrados</span></div></section>
      <section className="admin-layout"><form className="property-form" onSubmit={salvar}><div className="form-heading"><div><span className="admin-kicker">{editando ? "EDIÇÃO" : "NOVO ANÚNCIO"}</span><h2>{editando ? "Editar imóvel" : "Adicionar imóvel"}</h2></div>{editando && <button className="text-button" type="button" onClick={limparFormulario}><X size={14} /> Cancelar</button>}</div>
        <div className="form-grid"><label>Título<input value={form.titulo} onChange={(e) => alterar("titulo", e.target.value)} placeholder="Ex.: Casa com 3 quartos" required /></label><label>Tipo<select value={form.tipo} onChange={(e) => alterar("tipo", e.target.value)}><option>Casa</option><option>Sobrado</option><option>Apartamento</option><option>Terreno</option><option>Comercial</option></select></label><label>Cidade<input value={form.cidade} onChange={(e) => alterar("cidade", e.target.value)} required /></label><label>Estado<input value={form.estado} onChange={(e) => alterar("estado", e.target.value)} maxLength={2} required /></label></div>
        <label>Descrição<textarea value={form.descricao || ""} onChange={(e) => alterar("descricao", e.target.value)} rows={4} placeholder="Descreva os principais diferenciais do imóvel" /></label><div className="form-grid"><label>Preço (R$)<input type="number" min="0" step="0.01" value={form.preco} onChange={(e) => alterar("preco", e.target.value)} required /></label><label>Área (m²)<input type="number" min="0" value={form.area ?? ""} onChange={(e) => alterar("area", e.target.value ? Number(e.target.value) : null)} /></label><label>Quartos<input type="number" min="0" value={form.quartos ?? ""} onChange={(e) => alterar("quartos", e.target.value ? Number(e.target.value) : null)} /></label><label>Banheiros<input type="number" min="0" value={form.banheiros ?? ""} onChange={(e) => alterar("banheiros", e.target.value ? Number(e.target.value) : null)} /></label></div>
        <div className="upload-box"><div><strong><ImagePlus size={17} /> Foto do imóvel</strong><p>JPG, PNG ou WebP · até 5 MB</p><label className="upload-button">Escolher imagem<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionarArquivo} /></label></div>{(preview || form.imagemUrl) && <Image className="upload-preview" src={preview || form.imagemUrl} alt="Pré-visualização" width={150} height={100} />}</div><label className="checkbox-label"><input type="checkbox" checked={form.disponivel} onChange={(e) => alterar("disponivel", e.target.checked)} /> Exibir este imóvel no site</label><button className="btn gold form-submit" type="submit" disabled={carregando}><Plus size={17} /> {carregando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar imóvel"}</button>{mensagem && <p className="admin-message" role="status">{mensagem}</p>}</form>
        <aside className="admin-help"><strong>Como funciona</strong><p>Preencha as informações, escolha uma foto e publique o anúncio.</p><div className="help-step"><b>01</b><span>Informe os dados principais</span></div><div className="help-step"><b>02</b><span>Adicione uma boa foto</span></div><div className="help-step"><b>03</b><span>Publique o anúncio</span></div><a className="whatsapp-admin" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a></aside></section>
      <section className="property-list"><div className="list-heading"><div><span className="admin-kicker">CATÁLOGO</span><h2>Imóveis cadastrados</h2></div><span className="list-count">{imoveis.length} anúncios</span></div><div className="property-grid">{imoveis.map((imovel) => <article className="property-item" key={imovel.id}><div className="property-image">{imovel.imagemUrl && <Image src={imovel.imagemUrl} alt="" fill sizes="300px" />}<span className={imovel.disponivel ? "status available" : "status unavailable"}>{imovel.disponivel ? "Publicado" : "Oculto"}</span></div><div className="property-content"><span>{imovel.tipo} · {imovel.cidade}/{imovel.estado}</span><h3>{imovel.titulo}</h3><strong>{Number(imovel.preco) > 0 ? Number(imovel.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Consulte o valor"}</strong><div className="property-actions"><button type="button" onClick={() => iniciarEdicao(imovel)}><Pencil size={14} /> Editar</button><a className="whatsapp-card" href={`${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel: ${imovel.titulo}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> WhatsApp</a><button className="delete-button" type="button" onClick={() => remover(imovel.id)}><Trash2 size={14} /></button></div></div></article>)}</div></section>
    </div>
  </main>;
}
