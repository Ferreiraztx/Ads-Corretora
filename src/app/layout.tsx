import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andréia | Corretora de Imóveis",
  description: "Imóveis em Curitiba e Região",
  icon: "/imagens/logo.png",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
