"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Property = {
  id: number;
  titulo: string;
  tipo: string;
  cidade: string;
  estado: string;
  preco: number;
  imagemUrl: string | null;
  destaque: boolean;
};

const whatsapp = "https://wa.me/5541992371353";

export default function PropertyFilters({ properties }: { properties: Property[] }) {
  const [tipo, setTipo] = useState("");
  const [cidade, setCidade] = useState("");
  const [precoMaximo, setPrecoMaximo] = useState("");

  const tipos = useMemo(
    () => Array.from(new Set(properties.map((property) => property.tipo))).sort(),
    [properties],
  );
  const cidades = useMemo(
    () => Array.from(new Set(properties.map((property) => property.cidade))).sort(),
    [properties],
  );
  const filteredProperties = properties.filter((property) => {
    const matchesType = !tipo || property.tipo === tipo;
    const matchesCity = !cidade || property.cidade === cidade;
    const matchesPrice = !precoMaximo || property.preco <= Number(precoMaximo);
    return matchesType && matchesCity && matchesPrice;
  });

  function clearFilters() {
    setTipo("");
    setCidade("");
    setPrecoMaximo("");
  }

  return (
    <>
      <div className="property-filters" aria-label="Filtros de imóveis">
        <div className="filter-heading">
          <SlidersHorizontal size={18} />
          <strong>Encontre o imóvel ideal</strong>
        </div>
        <label>
          Tipo de imóvel
          <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
            <option value="">Todos os tipos</option>
            {tipos.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Cidade
          <select value={cidade} onChange={(event) => setCidade(event.target.value)}>
            <option value="">Todas as cidades</option>
            {cidades.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Preço máximo
          <select value={precoMaximo} onChange={(event) => setPrecoMaximo(event.target.value)}>
            <option value="">Qualquer valor</option>
            <option value="300000">Até R$ 300 mil</option>
            <option value="500000">Até R$ 500 mil</option>
            <option value="800000">Até R$ 800 mil</option>
            <option value="1000000">Até R$ 1 milhão</option>
          </select>
        </label>
        {(tipo || cidade || precoMaximo) && (
          <button type="button" className="clear-filters" onClick={clearFilters}>
            Limpar filtros
          </button>
        )}
      </div>

      <p className="filter-result">
        {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
      </p>

      <div className="cards">
        {filteredProperties.length === 0 ? (
          <div className="empty-filter">
            <Search size={24} />
            <p>Nenhum imóvel corresponde aos filtros selecionados.</p>
            <button type="button" className="btn gold" onClick={clearFilters}>Limpar filtros</button>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <article className={`card${property.destaque ? " featured-card" : ""}`} key={property.id}>
              {property.destaque && <span className="featured-badge">Destaque</span>}
              <Link className="card-link" href={`/imoveis/${property.id}`}>
                <div className="photo">
                  <Image src={property.imagemUrl || "/imagens/imovel-placeholder.svg"} alt={property.titulo} fill sizes="(max-width: 800px) 92vw, 350px" />
                </div>
                <div className="body">
                  <h3>{property.titulo}</h3>
                  <p>{property.cidade}/{property.estado}</p>
                  <div className="price">
                    {property.preco > 0
                      ? property.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : "Consulte o valor"}
                  </div>
                  <span className="btn gold">Ver detalhes</span>
                </div>
              </Link>
              <div className="card-contact">
                <a className="btn gold" target="_blank" rel="noopener noreferrer" href={`${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel: ${property.titulo}`)}`}>
                  <MessageCircle size={17} />
                  Tenho interesse
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
