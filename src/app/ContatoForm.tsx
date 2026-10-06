"use client";

import { FormEvent, useState } from "react";

export function ContatoForm() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviado(false);
    setErro("");
    const dados = Object.fromEntries(new FormData(event.currentTarget));
    const resposta = await fetch("/api/interessados", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) });
    if (!resposta.ok) {
      setErro((await resposta.json()).erro || "Não foi possível enviar seus dados.");
      return;
    }
    event.currentTarget.reset();
    setEnviado(true);
  }

  return <form className="lead-form" onSubmit={enviar}><h3>Deixe seu contato</h3><input name="nome" placeholder="Seu nome" required /><input name="telefone" placeholder="Telefone" required /><input name="email" type="email" placeholder="E-mail (opcional)" /><textarea name="mensagem" placeholder="O que você procura?" rows={3} /><button className="btn gold" type="submit">Enviar contato</button>{enviado && <p role="status">Recebemos seu contato. Em breve falaremos com você.</p>}{erro && <p role="alert">{erro}</p>}</form>;
}
