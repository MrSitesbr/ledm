import type { Metadata } from 'next';
import inicio from '@/content/inicio.json';
import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { duvidasPreenchidas } from '@/components/Duvidas';
import { Dobra, Faixas, Manifesto, PorQue, Solucoes } from '@/secoes/inicio/Topo';
import { Cases, ComoTrabalhamos, Plantao, AssistenteSdr, Comecar, BlocoDuvidas, ChamadaFinal } from '@/secoes/inicio/Base';
import { Efeitos } from '@/components/Efeitos';
import { Drone, Maquete } from '@/secoes/inicio/Maquete';
import { empresa } from '@/lib/dados';

export const metadata: Metadata = {
  title: { absolute: inicio.seo.titulo },
  description: inicio.seo.descricao,
  alternates: { canonical: '/' },
  openGraph: { title: inicio.seo.titulo, description: inicio.seo.descricao, url: '/' },
};

// Dados estruturados: sem nota, avaliação ou depoimento.
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: empresa.nome,
    url: empresa.dominio,
    telephone: empresa.telefoneSchema,
    address: {
      '@type': 'PostalAddress',
      addressLocality: empresa.cidade,
      addressRegion: empresa.uf,
      addressCountry: 'BR',
    },
    areaServed: empresa.cidadesAtendidas.map((c) => ({ '@type': 'City', name: c })),
    sameAs: [empresa.instagram, empresa.linkedin],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: duvidasPreenchidas.map((d) => ({
      '@type': 'Question',
      name: d.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: d.resposta },
    })),
  },
];

export default function Inicio() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Cabecalho />
      <main id="conteudo">
        <Dobra />
        <Faixas />
        <Manifesto />
        <PorQue />
        <Solucoes />
        <Maquete />
        <Drone />
        <Cases />
        <ComoTrabalhamos />
        <Plantao />
        <AssistenteSdr />
        <Comecar />
        <BlocoDuvidas />
        <ChamadaFinal />
      </main>
      <Rodape />
      <Efeitos />
    </>
  );
}
