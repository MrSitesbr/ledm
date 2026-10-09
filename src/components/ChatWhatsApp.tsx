'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Icone } from './Icone';

type Mensagem = {
  de: 'lead' | 'ia' | 'sistema';
  texto: string;
  hora?: string;
  anuncio?: boolean;
  captura?: Record<string, string>;
  final?: boolean;
};

export type TextosChat = {
  aviso: string;
  contato: string;
  contatoStatus: string;
  digitando: string;
  campoMensagem: string;
  anuncio: { titulo: string; texto: string; rotulo: string; imagem: string };
  ficha: { titulo: string; estado: string; pronto: string; campos: { id: string; rotulo: string }[] };
  conversa: Mensagem[];
};

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Duplo check azul (mensagem lida) */
function Lido() {
  return (
    <svg viewBox="0 0 18 11" className="inline-block h-[11px] w-[16px]" fill="none" stroke="var(--wa-check)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6l3 3 6-7.5M7 8.4L7.8 9l6-7.5" />
    </svg>
  );
}

/**
 * Simulação de conversa no WhatsApp: um interessado chega por um anúncio e o assistente SDR
 * responde, qualifica e passa o contato ao corretor. Roda quando entra na tela e recomeça no fim.
 */
export function ChatWhatsApp({ textos }: { textos: TextosChat }) {
  const [vistas, setVistas] = useState(0);
  const [digitando, setDigitando] = useState(false);
  const [ficha, setFicha] = useState<Record<string, string>>({});
  const [concluido, setConcluido] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const visivel = useRef(false);

  // Mantém a última mensagem à vista, rolando só dentro do celular
  useEffect(() => {
    const el = caixa.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [vistas, digitando]);

  useEffect(() => {
    let cancelado = false;
    let rodando = false;

    const rodar = async () => {
      if (rodando) return;
      rodando = true;
      while (!cancelado) {
        setVistas(0);
        setFicha({});
        setConcluido(false);
        await espera(700);
        for (let i = 0; i < textos.conversa.length && !cancelado; i++) {
          const m = textos.conversa[i];
          if (m.de === 'ia') {
            await espera(500);
            setDigitando(true);
            await espera(Math.min(900 + m.texto.length * 14, 2400));
            setDigitando(false);
          } else if (m.de === 'lead') {
            await espera(Math.min(1000 + m.texto.length * 18, 2600));
          } else {
            await espera(900);
          }
          if (cancelado) return;
          setVistas(i + 1);
          if (m.captura) {
            const cap = m.captura;
            await espera(450);
            setFicha((f) => ({ ...f, ...cap }));
          }
          if (m.final) setConcluido(true);
        }
        await espera(6000);
        // Só recomeça se a seção ainda estiver na tela
        while (!cancelado && !visivel.current) await espera(500);
      }
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        visivel.current = e.isIntersecting;
        if (e.isIntersecting) rodar();
      },
      { threshold: 0.35 },
    );
    if (raiz.current) obs.observe(raiz.current);
    return () => {
      cancelado = true;
      obs.disconnect();
    };
  }, [textos.conversa]);

  const mostradas = textos.conversa.slice(0, vistas);
  const a = textos.anuncio;

  return (
    <div ref={raiz} className="relative">
      {/* Transcrição para leitores de tela */}
      <ol className="sr-only">
        {textos.conversa.map((m, i) => (
          <li key={i}>
            {m.de === 'lead' ? 'Interessado: ' : m.de === 'ia' ? 'Assistente: ' : ''}
            {m.texto}
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="mx-auto w-full max-w-[360px] rounded-[2.75rem] bg-[#0b0b0b] p-2.5 shadow-[0_2.5rem_6rem_-1.5rem_rgb(0_0_0/0.65)] ring-1 ring-white/10">
        <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[2.2rem] sm:h-[640px]" style={{ color: 'var(--wa-texto)' }}>
          {/* Topo do WhatsApp */}
          <div className="flex items-center gap-3 px-3 pt-8 pb-2.5 text-white" style={{ background: 'var(--wa-topo)' }}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/20">
              <Icone nome="home" className="size-5" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[15px] font-semibold">{textos.contato}</p>
              <p className="text-[12px] text-white/80">{digitando ? textos.digitando : textos.contatoStatus}</p>
            </div>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6.5" width="12" height="11" rx="2" /><path d="M15 10.5l5-3v9l-5-3" /></svg>
            <Icone nome="phone" className="size-5" />
          </div>

          {/* Conversa */}
          <div ref={caixa} className="wa-papel flex-1 space-y-1.5 overflow-y-auto px-3 py-3 [scrollbar-width:none]">
            <p className="mx-auto mb-2 w-fit rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[color:var(--wa-hora)] shadow-sm">HOJE</p>

            {mostradas.map((m, i) => {
              if (m.de === 'sistema') {
                return (
                  <p key={i} className="balao mx-auto mt-2 flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium shadow-sm" style={{ background: 'var(--wa-sistema)' }}>
                    <Icone nome="check" className="size-4 text-[color:var(--wa-topo)]" />
                    {m.texto}
                  </p>
                );
              }
              const saida = m.de === 'lead';
              const anterior = mostradas[i - 1];
              const primeiroDoGrupo = !anterior || anterior.de !== m.de;
              return (
                <div key={i} className={`flex ${saida ? 'justify-end' : 'justify-start'} ${primeiroDoGrupo ? 'pt-1.5' : ''}`}>
                  <div
                    className={`balao ${saida ? 'balao-saida' : 'balao-entrada'} relative max-w-[82%] rounded-[10px] px-2.5 pt-1.5 pb-1 text-[14px] leading-snug shadow-[0_1px_0.5px_rgb(11_20_26/0.13)] ${
                      primeiroDoGrupo ? (saida ? 'rounded-tr-none' : 'rounded-tl-none') : ''
                    }`}
                    style={{ background: saida ? 'var(--wa-saida)' : 'var(--wa-entrada)' }}
                  >
                    {m.anuncio && (
                      <div className="mb-1.5 overflow-hidden rounded-md bg-black/5">
                        <Image src={a.imagem} alt="" width={300} height={150} className="h-24 w-full object-cover" />
                        <div className="px-2 py-1.5">
                          <p className="text-[10px] font-semibold tracking-wide text-[color:var(--wa-hora)] uppercase">{a.rotulo}</p>
                          <p className="text-[13px] font-semibold">{a.titulo}</p>
                          <p className="text-[12px] text-[color:var(--wa-hora)]">{a.texto}</p>
                        </div>
                      </div>
                    )}
                    <span>{m.texto}</span>
                    <span className="float-right mt-1.5 ml-2 flex items-center gap-1 text-[11px] text-[color:var(--wa-hora)]">
                      {m.hora}
                      {saida && <Lido />}
                    </span>
                  </div>
                </div>
              );
            })}

            {digitando && (
              <div className="flex justify-start pt-1.5">
                <div className="balao balao-entrada flex gap-1 rounded-[10px] rounded-tl-none px-3.5 py-3 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]" style={{ background: 'var(--wa-entrada)' }}>
                  <span className="ponto-digitando size-2 rounded-full bg-[color:var(--wa-hora)]" />
                  <span className="ponto-digitando size-2 rounded-full bg-[color:var(--wa-hora)]" />
                  <span className="ponto-digitando size-2 rounded-full bg-[color:var(--wa-hora)]" />
                </div>
              </div>
            )}
          </div>

          {/* Barra de digitação */}
          <div className="flex items-center gap-2 px-2 py-2" style={{ background: 'var(--wa-fundo)' }}>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2.5 text-[14px] text-[color:var(--wa-hora)]">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.5 4.5 0 007 0M9 9.5h.01M15 9.5h.01" strokeLinecap="round" /></svg>
              {textos.campoMensagem}
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-full text-white" style={{ background: 'var(--wa-topo)' }}>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" /></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Ficha do contato, preenchida pela IA durante a conversa: compacta, embaixo do celular */}
      <div aria-hidden="true" className="mx-auto mt-4 w-full max-w-[360px] rounded-xl bg-[#000000] px-3.5 py-3 text-sobre-azul ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <p className="font-[family-name:var(--font-titulo)] font-extrabold tracking-wide uppercase">{textos.ficha.titulo}</p>
          <span className="flex items-center gap-1.5 text-sobre-azul-2">
            <span className={`size-1.5 rounded-full ${concluido ? 'bg-amarelo' : 'animate-pulse bg-sobre-azul-2'}`} />
            {concluido ? textos.ficha.pronto : textos.ficha.estado}
          </span>
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] leading-tight">
          {textos.ficha.campos.map((c) => (
            <div key={c.id} className="flex min-w-0 items-baseline gap-1.5">
              <dt className="shrink-0 text-sobre-azul-3">{c.rotulo}:</dt>
              <dd className="min-w-0 font-semibold">
                {ficha[c.id] ? (
                  <span key={ficha[c.id]} className="campo-preenchido text-amarelo">{ficha[c.id]}</span>
                ) : (
                  <span className="text-sobre-azul-3">...</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-3 text-center text-[11px] text-sobre-azul-3">{textos.aviso}</p>
    </div>
  );
}
