'use client';

import { useState } from 'react';
import { Icone } from './Icone';

/** Cartão com imagem e frases que trocam com setas (como o depoimento do Aura, mas sem autor). */
export function SliderFrases({
  frases,
  rotulo,
  imagem,
  anterior,
  proxima,
}: {
  frases: string[];
  rotulo: string;
  imagem: string;
  anterior: string;
  proxima: string;
}) {
  const [i, setI] = useState(0);
  const ir = (d: number) => setI((x) => (x + d + frases.length) % frases.length);
  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[var(--radius-painel)] text-sobre-azul sm:min-h-[26rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imagem} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgb(7 11 38 / 0.94) 10%, rgb(7 11 38 / 0.55) 70%, rgb(7 11 38 / 0.25))' }} />
      <div className="relative flex h-full min-h-[22rem] flex-col justify-between p-7 sm:min-h-[26rem] sm:p-10">
        <div className="flex items-center justify-between">
          <p className="rotulo text-sobre-azul-2">{rotulo}</p>
          <p className="numeros text-sm text-sobre-azul-3">
            {i + 1} / {String(frases.length).padStart(2, '0')}
          </p>
        </div>
        <blockquote key={i} className="max-w-[26ch] font-[family-name:var(--font-titulo)] text-[clamp(1.35rem,2.6vw,2rem)] leading-tight font-bold" style={{ animation: 'palavra-entra .6s ease both' }} aria-live="polite">
          “{frases[i]}”
        </blockquote>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => ir(-1)} aria-label={anterior} className="inline-flex size-11 items-center justify-center rounded-full border border-linha-azul text-sobre-azul transition hover:bg-white/10">
            <Icone nome="arrow-right" className="size-5 rotate-180" />
          </button>
          <button type="button" onClick={() => ir(1)} aria-label={proxima} className="inline-flex size-11 items-center justify-center rounded-full bg-branco text-tinta transition hover:-translate-y-px">
            <Icone nome="arrow-right" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
