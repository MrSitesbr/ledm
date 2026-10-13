'use client';

import { useState } from 'react';
import inicio from '@/content/inicio.json';
import comum from '@/content/comum.json';
import { Botao } from '@/components/Botao';
import { Maquete3D } from '@/components/Maquete3D';

const m = inicio.maquete;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* Maquete virtual interativa: seção alta com palco fixo; a rolagem orbita o prédio
   e as quatro etapas aparecem em sequência (como no HTML de referência "Parallax 3D"). */
export function Maquete() {
  const [p, setP] = useState(0);
  return (
    <section id="maquete" className="relative h-[480vh] text-sobre-azul" style={{ background: 'var(--color-azul-fundo)' }} aria-labelledby="titulo-maquete">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Maquete3D modo="secao" alvoId="maquete" aoProgresso={setP} />
        {/* Leitura: escurece embaixo e à esquerda, onde ficam os textos */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(7 11 38 / 0.55) 0%, transparent 30%, transparent 55%, rgb(7 11 38 / 0.85) 100%), linear-gradient(90deg, rgb(7 11 38 / 0.6), transparent 55%)' }} />
        <p className="absolute inset-0 grid place-items-center text-sm text-sobre-azul-3" aria-hidden="true" style={{ zIndex: -1 }}>{m.carregando}</p>

        {/* Título de abertura */}
        <div className="container-site relative pt-24 text-center sm:pt-28" style={{ opacity: clamp(1 - p * 8, 0, 1) }}>
          <p className="rotulo text-amarelo">{m.rotulo}</p>
          <h2 id="titulo-maquete" className="mx-auto mt-4 max-w-[22ch] font-[family-name:var(--font-titulo)] text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.06] font-black tracking-[-0.03em]">
            {m.titulo}
          </h2>
          <p className="rotulo mt-8 text-sobre-azul-3">{m.dica} ↓</p>
        </div>

        {/* Etapas */}
        {m.etapas.map((e) => {
          const on = Math.abs(p - e.em) < 0.09;
          return (
            <div
              key={e.no}
              className="absolute bottom-[14vh] left-[max(6vw,1.5rem)] max-w-[min(440px,84vw)] transition-all duration-700"
              style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(24px)' }}
              aria-hidden={!on}
            >
              <p className="rotulo text-amarelo">{e.no}</p>
              <h3 className="mt-3 font-[family-name:var(--font-titulo)] text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.08] font-black tracking-[-0.02em]">{e.titulo}</h3>
              <p className="mt-3 leading-relaxed text-sobre-azul-2">{e.texto}</p>
            </div>
          );
        })}

        {/* Fim: chamada */}
        <div className="absolute inset-x-0 bottom-[10vh] px-6 text-center transition-all duration-700" style={{ opacity: p > 0.93 ? 1 : 0, transform: p > 0.93 ? 'none' : 'translateY(24px)', pointerEvents: p > 0.93 ? 'auto' : 'none' }}>
          <p className="rotulo text-amarelo">{m.fimRotulo}</p>
          <h3 className="mx-auto mt-3 max-w-[26ch] font-[family-name:var(--font-titulo)] text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.1] font-black">{m.fimTitulo}</h3>
          <p className="mx-auto mt-3 max-w-[48ch] text-sobre-azul-2">{m.fimTexto}</p>
          <Botao href="#contato" className="mt-6">{comum.botaoPrincipal}</Botao>
        </div>

        {/* Barra de progresso e crédito */}
        <div aria-hidden="true" className="absolute top-1/2 right-5 h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
          <div className="w-full rounded-full" style={{ height: `${p * 100}%`, background: 'var(--grad-luz)' }} />
        </div>
        <a href={m.creditoLink} target="_blank" rel="noopener noreferrer" className="absolute right-4 bottom-3 text-[11px] text-sobre-azul-3 underline-offset-2 hover:underline">
          {m.credito}
        </a>

        {/* Leitores de tela: todas as etapas em texto */}
        <ol className="sr-only">
          {m.etapas.map((e) => <li key={e.no}>{e.titulo}. {e.texto}</li>)}
        </ol>
      </div>
    </section>
  );
}
