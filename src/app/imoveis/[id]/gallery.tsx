"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Gallery({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [ativa, setAtiva] = useState(0);
  const [aberta, setAberta] = useState<number | null>(null);
  const anterior = () => {
    const proximaFoto = (ativa - 1 + fotos.length) % fotos.length;
    setAtiva(proximaFoto);
    if (aberta != null) setAberta(proximaFoto);
  };
  const proxima = () => {
    const proximaFoto = (ativa + 1) % fotos.length;
    setAtiva(proximaFoto);
    if (aberta != null) setAberta(proximaFoto);
  };
  const selecionar = (indice: number) => {
    setAtiva(indice);
    if (aberta != null) setAberta(indice);
  };
  useEffect(() => {
    if (aberta == null) return;
    const tecla = (event: KeyboardEvent) => { if (event.key === "Escape") setAberta(null); if (event.key === "ArrowLeft") anterior(); if (event.key === "ArrowRight") proxima(); };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  });
  return <div className="gallery">
    <div className="gallery-main">
      <button className="gallery-main-image" onClick={() => setAberta(ativa)} aria-label={`Ampliar foto ${ativa + 1}`}>
        <Image src={fotos[ativa]} alt={`${titulo} - foto ${ativa + 1}`} fill sizes="(max-width: 800px) 92vw, 760px" priority={ativa === 0} />
      </button>
      {fotos.length > 1 && <><button className="gallery-arrow gallery-arrow-left" onClick={anterior} aria-label="Foto anterior"><ChevronLeft /></button><button className="gallery-arrow gallery-arrow-right" onClick={proxima} aria-label="Próxima foto"><ChevronRight /></button></>}
    </div>
    <div className="gallery-thumbs">{fotos.map((foto, index) => <button className={index === ativa ? "active" : ""} key={`${foto}-${index}`} onClick={() => selecionar(index)} aria-label={`Mostrar foto ${index + 1}`}><Image src={foto} alt={`${titulo} - miniatura ${index + 1}`} fill sizes="180px" /></button>)}</div>
    {aberta != null && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setAberta(null)}><button className="lightbox-close" onClick={() => setAberta(null)}><X /></button><button className="lightbox-arrow left" onClick={(event) => { event.stopPropagation(); anterior(); }}><ChevronLeft /></button><Image src={fotos[aberta]} alt={`${titulo} ${aberta + 1}`} width={1400} height={900} onClick={(event) => event.stopPropagation()} /><button className="lightbox-arrow right" onClick={(event) => { event.stopPropagation(); proxima(); }}><ChevronRight /></button><span>{aberta + 1} / {fotos.length}</span></div>}
  </div>;
}
