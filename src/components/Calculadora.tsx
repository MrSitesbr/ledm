'use client';

import { useId, useState } from 'react';
import { brl, calculadora as base } from '@/lib/dados';
import { registrarEvento } from '@/lib/medicao';
import comum from '@/content/comum.json';

type Campos = {
  valorUnidade: string;
  margemPercentual: string;
  contatosPorMes: string;
  semRespostaPercentual: string;
};

type Textos = {
  titulo: string;
  campos: Record<keyof Campos, string>;
  resultado: string;
};

const numero = (s: string) => Number(s.replace(/\D/g, '')) || 0;

/** Calcula só a linha do contato sem resposta. Com os valores iniciais: R$4.608 e R$2.304. */
export function calcular(c: { valorUnidade: number; margemPercentual: number; contatosPorMes: number; semRespostaPercentual: number }) {
  const margemPorVenda = c.valorUnidade * (c.margemPercentual / 100);
  const semResposta = c.contatosPorMes * (c.semRespostaPercentual / 100);
  return {
    minimo: semResposta * base.taxaMinimo * margemPorVenda,
    realista: semResposta * base.taxaRealista * margemPorVenda,
  };
}

export function Calculadora({ textos }: { textos: Textos }) {
  const id = useId();
  const [usou, setUsou] = useState(false);
  const [v, setV] = useState<Campos>({
    valorUnidade: base.valorUnidade.toLocaleString('pt-BR'),
    margemPercentual: String(base.margemPercentual),
    contatosPorMes: String(base.contatosPorMes),
    semRespostaPercentual: String(base.semRespostaPercentual),
  });

  const r = calcular({
    valorUnidade: numero(v.valorUnidade),
    margemPercentual: Math.min(100, numero(v.margemPercentual)),
    contatosPorMes: numero(v.contatosPorMes),
    semRespostaPercentual: Math.min(100, numero(v.semRespostaPercentual)),
  });

  const atualizar = (campo: keyof Campos, valor: string) => {
    let limpo = valor.replace(/\D/g, '').slice(0, campo === 'valorUnidade' ? 9 : 4);
    if (campo === 'valorUnidade' && limpo) limpo = Number(limpo).toLocaleString('pt-BR');
    setV((x) => ({ ...x, [campo]: limpo }));
    if (!usou) {
      setUsou(true);
      registrarEvento('usou_calculadora');
    }
  };

  const config: { campo: keyof Campos; prefixo?: string; sufixo?: string }[] = [
    { campo: 'valorUnidade', prefixo: 'R$' },
    { campo: 'margemPercentual', sufixo: '%' },
    { campo: 'contatosPorMes' },
    { campo: 'semRespostaPercentual', sufixo: '%' },
  ];

  const frase = textos.resultado
    .replace('[realista]', brl(r.realista))
    .replace('[minimo]', brl(r.minimo));

  return (
    <div className="rounded-[var(--radius-cartao)] p-6 sm:p-8" style={{ background: 'var(--color-azul-noite)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold sm:text-2xl">{textos.titulo}</h3>
        <span className="rotulo inline-flex items-center rounded-full border border-linha-azul px-3 py-1.5 text-sobre-azul-2">
          {comum.estimativa}
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {config.map(({ campo, prefixo, sufixo }) => (
          <div key={campo}>
            <label htmlFor={`${id}-${campo}`} className="mb-2 block text-sm font-semibold text-sobre-azul-2">
              {textos.campos[campo]}
            </label>
            <div className="flex min-h-12 items-center gap-2 rounded-[var(--radius-botao)] border border-linha-azul px-4 focus-within:border-amarelo">
              {prefixo && <span className="text-sobre-azul-3">{prefixo}</span>}
              <input
                id={`${id}-${campo}`}
                inputMode="numeric"
                autoComplete="off"
                value={v[campo]}
                onChange={(e) => atualizar(campo, e.target.value)}
                className="numeros w-full bg-transparent py-3 text-lg font-semibold text-sobre-azul outline-none"
              />
              {sufixo && <span className="text-sobre-azul-3">{sufixo}</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="numeros mt-6 text-lg leading-relaxed text-sobre-azul" aria-live="polite">
        {frase}
      </p>
    </div>
  );
}
