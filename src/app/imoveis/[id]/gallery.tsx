"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Gallery({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [aberta, setAberta] = useState<number | null>(null);
  const anterior = () => setAberta((atual) => atual == null ? 0 : (atual - 1 + fotos.length) % fotos.length);
  const proxima = () => setAberta((atual) => atual == null ? 0 : (atual + 1) % fotos.length);
  useEffect(() => {
    if (aberta == null) return;
    const tecla = (event: KeyboardEvent) => { if (event.key === "Escape") setAberta(null); if (event.key === "ArrowLeft") anterior(); if (event.key === "ArrowRight") proxima(); };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  });
  return <div className="gallery"><button className="gallery-main" onClick={() => setAberta(0)}><Image src={fotos[0]} alt={titulo} fill sizes="(max-width: 800px) 92vw, 760px" priority /></button><div className="gallery-thumbs">{fotos.slice(1).map((foto, index) => <button key={`${foto}-${index}`} onClick={() => setAberta(index + 1)}><Image src={foto} alt={`${titulo} ${index + 2}`} fill sizes="180px" /></button>)}</div>{aberta != null && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setAberta(null)}><button className="lightbox-close" onClick={() => setAberta(null)}><X /></button><button className="lightbox-arrow left" onClick={(event) => { event.stopPropagation(); anterior(); }}><ChevronLeft /></button><Image src={fotos[aberta]} alt={`${titulo} ${aberta + 1}`} width={1400} height={900} onClick={(event) => event.stopPropagation()} /><button className="lightbox-arrow right" onClick={(event) => { event.stopPropagation(); proxima(); }}><ChevronRight /></button><span>{aberta + 1} / {fotos.length}</span></div>}</div>;
}
