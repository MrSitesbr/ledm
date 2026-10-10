'use client';

import { useId, useState, type FormEvent } from 'react';
import textos from '@/content/reuniao.json';
import { empresa, whatsappLink } from '@/lib/dados';
import { registrarEvento } from '@/lib/medicao';
import { Icone } from './Icone';

const f = textos.form;
type Campo = 'tipo' | 'cidade' | 'desafio' | 'quando' | 'nome' | 'whatsapp' | 'empresa';
const etapas: Campo[][] = [['tipo', 'cidade', 'desafio', 'quando'], ['nome', 'whatsapp', 'empresa']];

function mascara(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Formulário em 2 etapas (como o da Agência de Valor). Hoje abre o WhatsApp; depois será ligado ao Supabase. */
export function FormularioCall() {
  const id = useId();
  const [etapa, setEtapa] = useState(0);
  const [v, setV] = useState<Record<Campo, string>>({ tipo: '', cidade: '', desafio: '', quando: '', nome: '', whatsapp: '', empresa: '' });
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});

  const validar = (campos: Campo[]) => {
    const e: Partial<Record<Campo, string>> = {};
    campos.forEach((c) => {
      if (!v[c].trim()) e[c] = f.erro;
    });
    if (campos.includes('whatsapp') && v.whatsapp && v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = f.erroWhatsapp;
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) document.getElementById(`${id}-${primeiro}`)?.focus();
    return !primeiro;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    if (etapa === 0) {
      if (validar(etapas[0])) setEtapa(1);
      return;
    }
    if (!validar(etapas[1])) return;
    let msg = f.mensagem;
    (Object.keys(v) as Campo[]).forEach((c) => (msg = msg.replace(`[${c}]`, v[c].trim())));
    const origem = new URLSearchParams(window.location.search).get('utm_source');
    if (origem) msg += ` Origem: ${origem}`;
    registrarEvento('pedido_teste', { pagina: 'reuniao', tipo: v.tipo });
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
  };

  const classe = (c: Campo) =>
    `w-full min-h-12 appearance-none rounded-[var(--radius-botao)] border bg-white/5 px-4 py-3 text-[15px] text-sobre-azul placeholder:text-sobre-azul-3 outline-none focus:border-amarelo ${erros[c] ? 'border-2 border-sobre-azul' : 'border-linha-azul'}`;

  const campo = (c: Campo) => {
    const cfg = f.campos[c] as { rotulo: string; placeholder?: string; opcoes?: string[] };
    const lista = c === 'cidade' ? empresa.cidadesFormulario : cfg.opcoes;
    const comum = {
      id: `${id}-${c}`,
      value: v[c],
      className: classe(c),
      'aria-invalid': !!erros[c],
      'aria-describedby': erros[c] ? `${id}-${c}-erro` : undefined,
    };
    return (
      <div key={c} className={c === 'tipo' || c === 'cidade' ? '' : 'sm:col-span-2'}>
        <label htmlFor={`${id}-${c}`} className="rotulo mb-2 block !text-[0.72rem] text-sobre-azul-2">{cfg.rotulo}</label>
        {lista ? (
          <div className="relative">
            <select {...comum} onChange={(e) => setV({ ...v, [c]: e.target.value })}>
              <option value="" disabled className="bg-branco text-tinta">{cfg.placeholder}</option>
              {lista.map((o) => <option key={o} value={o} className="bg-branco text-tinta">{o}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sobre-azul-3">▾</span>
          </div>
        ) : (
          <input
            {...comum}
            type={c === 'whatsapp' ? 'tel' : 'text'}
            inputMode={c === 'whatsapp' ? 'tel' : undefined}
            autoComplete={c === 'nome' ? 'name' : c === 'whatsapp' ? 'tel-national' : 'organization'}
            placeholder={cfg.placeholder}
            onChange={(e) => setV({ ...v, [c]: c === 'whatsapp' ? mascara(e.target.value) : e.target.value })}
          />
        )}
        {erros[c] && <p id={`${id}-${c}-erro`} className="mt-1.5 text-sm font-semibold text-sobre-azul">{erros[c]}</p>}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={enviar} className="rounded-[24px] border border-white/15 bg-[rgb(7_11_38/0.82)] p-6 shadow-[0_2rem_5rem_-1.5rem_rgb(0_0_0/0.7)] backdrop-blur-md sm:p-8">
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-linha-azul text-amarelo">
          <Icone nome="calendar" className="size-5" />
        </span>
        <h2 className="font-[family-name:var(--font-titulo)] text-2xl font-black tracking-[-0.02em]">{f.titulo}</h2>
      </div>
      <p className="mt-2 text-center text-sm text-sobre-azul-2">{f.subtitulo}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: etapa === 0 ? '50%' : '100%', background: 'var(--grad-luz)' }} />
        </div>
        <span className="rotulo !text-[0.68rem] text-sobre-azul-3">{f.etapa.replace('[n]', String(etapa + 1))}</span>
      </div>
      <div key={etapa} className="mt-6 grid gap-4 sm:grid-cols-2" style={{ animation: 'palavra-entra .45s ease both' }}>
        {etapas[etapa].map(campo)}
      </div>
      <div className="mt-6 flex gap-3">
        {etapa === 1 && (
          <button type="button" onClick={() => setEtapa(0)} className="botao botao-secundario !px-4">{f.voltar}</button>
        )}
        <button type="submit" className="botao botao-principal flex-1">
          <span>{etapa === 0 ? f.continuar : f.enviar}</span>
          <Icone nome="arrow-right" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-sobre-azul-3">{f.nota}</p>
    </form>
  );
}
