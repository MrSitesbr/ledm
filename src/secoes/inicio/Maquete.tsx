'use client';

import { useEffect, useRef, useState } from 'react';
import inicio from '@/content/inicio.json';
import comum from '@/content/comum.json';
import { Botao } from '@/components/Botao';
import { Maquete3D } from '@/components/Maquete3D';
import { Drone3D } from '@/components/Drone3D';

const m = inicio.maquete;
const dr = inicio.drone;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* Maquete virtual interativa: seção alta com palco fixo; a rolagem orbita o prédio
   e as quatro etapas aparecem em sequência (como no HTML de referência "Parallax 3D"). */
export function Maquete() {
  const [p, setP] = useState(0);
  return (
    <section id="maquete" className="relative h-[480vh] text-sobre-azul" style={{ background: 'var(--color-azul-fundo)' }} aria-labelledby="titulo-maquete">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Maquete3D alvoId="maquete" aoProgresso={setP} />
        {/* Leitura: escurece embaixo e à esquerda, onde ficam os textos */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(7 11 38 / 0.55) 0%, transparent 30%, transparent 55%, rgb(7 11 38 / 0.85) 100%), linear-gradient(90deg, rgb(7 11 38 / 0.6), transparent 55%)' }} />
        {/* Sombra extra só enquanto o título de abertura aparece */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: clamp(1 - p * 8, 0, 1), background: 'linear-gradient(90deg, rgb(7 11 38 / 0.7), rgb(7 11 38 / 0.3) 50%, transparent 75%), linear-gradient(180deg, rgb(7 11 38 / 0.5), transparent 45%)' }} />
        <p className="absolute inset-0 grid place-items-center text-sm text-sobre-azul-3" aria-hidden="true" style={{ zIndex: -1 }}>{m.carregando}</p>

        {/* Título de abertura */}
        <div className="relative pt-24 pr-6 pl-[max(6vw,1.5rem)] text-left sm:pt-28" style={{ opacity: clamp(1 - p * 8, 0, 1), textShadow: '0 2px 18px rgb(7 11 38 / 0.6)' }}>
          <p className="rotulo text-amarelo">{m.rotulo}</p>
          <h2 id="titulo-maquete" className="mt-4 max-w-[22ch] font-[family-name:var(--font-titulo)] text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.06] font-black tracking-[-0.03em]">
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
        <div className="absolute bottom-[10vh] left-[max(6vw,1.5rem)] max-w-[min(560px,84vw)] text-left transition-all duration-700" style={{ textShadow: '0 2px 18px rgb(7 11 38 / 0.6)', opacity: p > 0.93 ? 1 : 0, transform: p > 0.93 ? 'none' : 'translateY(24px)', pointerEvents: p > 0.93 ? 'auto' : 'none' }}>
          <p className="rotulo text-amarelo">{m.fimRotulo}</p>
          <h3 className="mt-3 max-w-[26ch] font-[family-name:var(--font-titulo)] text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.1] font-black">{m.fimTitulo}</h3>
          <p className="mt-3 max-w-[48ch] text-sobre-azul-2">{m.fimTexto}</p>
          <Botao href="#contato" className="mt-6">{comum.botaoPrincipal}</Botao>
        </div>

        {/* Barra de progresso */}
        <div aria-hidden="true" className="absolute top-1/2 right-5 h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
          <div className="w-full rounded-full" style={{ height: `${p * 100}%`, background: 'var(--grad-luz)' }} />
        </div>

        {/* Leitores de tela: todas as etapas em texto */}
        <ol className="sr-only">
          {m.etapas.map((e) => <li key={e.no}>{e.titulo}. {e.texto}</li>)}
        </ol>
      </div>
    </section>
  );
}

/* Etapa 2 da seção: vídeos com drone (HTML de referência "secao-drone.html").
   Mesmo esquema da maquete: palco fixo, a rolagem orbita o drone e as cinco etapas
   aparecem em cartões com miniatura. Céu, sol e nuvens com parallax ao fundo. */
const nuvens = [
  { left: '5%', top: '14%', w: '34vmin', s: 0.25 },
  { left: '62%', top: '26%', w: '44vmin', s: 0.4 },
  { left: '22%', top: '58%', w: '34vmin', s: 0.6 },
];

export function Drone() {
  const [p, setP] = useState(0);
  const [carregado, setCarregado] = useState(false);
  const com3d = useRef(false);
  // Plano B: sem 3D (WebGL indisponível ou modelo com erro), a rolagem comanda etapas e fechamento
  useEffect(() => {
    const alvo = document.getElementById('drone-rolagem');
    if (!alvo) return;
    const rolar = () => {
      if (com3d.current) return;
      const r = alvo.getBoundingClientRect();
      setP(clamp(-r.top / (r.height - window.innerHeight), 0, 1));
    };
    rolar();
    window.addEventListener('scroll', rolar, { passive: true });
    return () => window.removeEventListener('scroll', rolar);
  }, []);
  const progresso3d = (v: number) => {
    com3d.current = true;
    setP(v);
  };
  const fim = p > 0.79; // de 0.79 até soltar a seção: fechamento visível
  return (
    <section id="drone" className="relative text-sobre-azul" style={{ background: 'var(--color-azul-fundo)' }} aria-labelledby="titulo-drone">
      <div id="drone-rolagem" className="relative h-[720vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: 'linear-gradient(#071328 0%, #12305e 40%, #2f6db5 75%, #8cc4f5 100%)' }}>
          {/* Sol e nuvens (parallax) */}
          <div aria-hidden="true" className="absolute left-[68%] top-[62%] size-[44vmin] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, #eaf5ff, #8cc4ff 40%, transparent 70%)', transform: `translate3d(${-p * 18}vw, ${-p * 30}vh, 0)` }} />
          {nuvens.map((n) => (
            <div key={n.left} aria-hidden="true" className="absolute h-[9vmin] rounded-[50%] bg-white/12 blur-[14px]" style={{ left: n.left, top: n.top, width: n.w, transform: `translate3d(${p * 600 * n.s * 0.25 - p * 8}px, ${-p * 600 * n.s * 0.12}px, 0)` }} />
          ))}
          {!carregado && !fim && <p className="absolute inset-0 grid place-items-center text-sm text-sobre-azul-3" aria-hidden="true">{dr.carregando}</p>}
          <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: fim ? 0 : 1 }}>
            <Drone3D alvoId="drone-rolagem" aoProgresso={progresso3d} aoCarregar={() => setCarregado(true)} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, transparent 45%, rgb(5 10 25 / 0.55))' }} />
          {/* Sombra extra só enquanto o título de abertura aparece */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: clamp(1 - p * 28, 0, 1), background: 'linear-gradient(90deg, rgb(5 10 25 / 0.7), rgb(5 10 25 / 0.3) 50%, transparent 75%)' }} />

          {/* Título de abertura */}
          <div className="absolute top-[calc(6rem+2vh)] left-[max(6vw,1.5rem)] max-w-[min(560px,88vw)] lg:top-1/2 lg:-translate-y-[55%]" style={{ opacity: clamp(1 - p * 28, 0, 1), textShadow: '0 2px 18px rgb(5 10 25 / 0.6)' }}>
            <p className="rotulo text-amarelo">{dr.rotulo}</p>
            <h2 id="titulo-drone" className="mt-4 font-[family-name:var(--font-titulo)] text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.06] font-black tracking-[-0.03em]">
              {dr.titulo}
            </h2>
            <p className="rotulo mt-8 text-sobre-azul-2">{dr.dica} ↓</p>
          </div>

          {/* Etapas: cartão de vidro com miniatura */}
          {dr.etapas.map((e) => {
            const on = Math.abs(p - e.em) < 0.065;
            return (
              <div
                key={e.no}
                className="absolute bottom-[12vh] left-[max(6vw,1rem)] flex max-w-[min(580px,calc(100vw-2rem))] items-stretch gap-3 rounded-2xl border border-white/15 p-3 shadow-[0_14px_40px_rgb(0_0_0/0.35)] backdrop-blur-md transition-all duration-700 sm:gap-4 sm:p-3.5"
                style={{ background: 'rgb(7 19 40 / 0.62)', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(24px)' }}
                aria-hidden={!on}
              >
                <div className="aspect-square w-[clamp(84px,9vw,128px)] shrink-0 overflow-hidden rounded-[11px] border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.imagem} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                </div>
                <div className="min-w-0 self-center">
                  <p className="rotulo text-amarelo">{e.no}</p>
                  <h3 className="mt-1.5 font-[family-name:var(--font-titulo)] text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.12] font-black tracking-[-0.02em]">{e.titulo}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-snug text-sobre-azul-2 sm:text-[0.9rem] sm:leading-relaxed">{e.texto}</p>
                </div>
              </div>
            );
          })}

          {/* Fechamento: última mensagem da seção, texto à esquerda e piloto à direita */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-700" style={{ opacity: fim ? 1 : 0, background: 'linear-gradient(90deg, rgb(5 10 25 / 0.75), rgb(5 10 25 / 0.35) 50%, transparent 75%)' }} />
          <div className="absolute inset-0 grid grid-rows-[1fr_auto] transition-all duration-700 lg:grid-cols-2 lg:grid-rows-1" style={{ opacity: fim ? 1 : 0, transform: fim ? 'none' : 'translateY(24px)', pointerEvents: fim ? 'auto' : 'none' }} inert={!fim}>
            <div className="self-center pt-24 pr-6 pl-[max(6vw,1.5rem)] text-left lg:pt-0" style={{ textShadow: '0 2px 18px rgb(5 10 25 / 0.6)' }}>
              <p className="rotulo text-amarelo">{dr.fimRotulo}</p>
              <h3 className="mt-3 max-w-[22ch] font-[family-name:var(--font-titulo)] text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] font-black tracking-[-0.02em]">{dr.fimTitulo}</h3>
              <p className="mt-4 max-w-[46ch] text-sobre-azul-2">{dr.fimTexto}</p>
              <Botao href="#contato" className="mt-7">{comum.botaoPrincipal}</Botao>
            </div>
            <div className="flex items-end justify-center lg:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/piloto-drone.webp" alt={dr.fimImagemAlt} width={903} height={600} loading="lazy" decoding="async" className="block h-auto max-h-[42svh] w-auto max-w-full lg:max-h-[78svh]" />
            </div>
          </div>

          {/* Barra de progresso */}
          <div aria-hidden="true" className="absolute top-1/2 right-5 h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-opacity duration-700" style={{ opacity: fim ? 0 : 1 }}>
            <div className="w-full rounded-full" style={{ height: `${p * 100}%`, background: 'var(--grad-luz)' }} />
          </div>

          {/* Leitores de tela: todas as etapas em texto */}
          <ol className="sr-only">
            {dr.etapas.map((e) => <li key={e.no}>{e.titulo}. {e.texto}</li>)}
          </ol>
        </div>
      </div>

    </section>
  );
}
