'use client';

import { useId, useState, type FormEvent } from 'react';
import q from '@/content/quem-somos.json';
import { whatsappLink } from '@/lib/dados';
import { Icone } from './Icone';

const t = q.trabalhe;
type Campo = 'nome' | 'whatsapp' | 'area' | 'portfolio';

function mascara(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Formulário "Faça parte da equipe": abre o WhatsApp com a mensagem pronta, não guarda dados. */
export function FormularioEquipe() {
  const id = useId();
  const [v, setV] = useState<Record<Campo, string>>({ nome: '', whatsapp: '', area: '', portfolio: '' });
  const [erros, setErros] = useState<Partial<Record<Campo, boolean>>>({});

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Partial<Record<Campo, boolean>> = {};
    if (!v.nome.trim()) e.nome = true;
    if (v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = true;
    if (!v.area) e.area = true;
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) return document.getElementById(`${id}-${primeiro}`)?.focus();
    const msg = t.mensagem
      .replace('[nome]', v.nome.trim())
      .replace('[area]', v.area)
      .replace('[portfolio]', v.portfolio.trim() || 'não informado')
      .replace('[whatsapp]', v.whatsapp);
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
  };

  const classe = (c: Campo) =>
    `w-full min-h-12 appearance-none rounded-[var(--radius-botao)] border bg-white/5 px-4 py-3 text-[15px] text-sobre-azul placeholder:text-sobre-azul-3 outline-none focus:border-amarelo ${erros[c] ? 'border-2 border-sobre-azul' : 'border-linha-azul'}`;
  const rotulo = (c: Campo) => (
    <label htmlFor={`${id}-${c}`} className="rotulo mb-2 block !text-[0.72rem] text-sobre-azul-2">{t.campos[c]}</label>
  );
  const erro = (c: Campo) => erros[c] && <p className="mt-1.5 text-sm font-semibold text-sobre-azul">{t.erro}</p>;

  return (
    <form noValidate onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
      <div>
        {rotulo('nome')}
        <input id={`${id}-nome`} autoComplete="name" value={v.nome} aria-invalid={!!erros.nome} onChange={(e) => setV({ ...v, nome: e.target.value })} className={classe('nome')} />
        {erro('nome')}
      </div>
      <div>
        {rotulo('whatsapp')}
        <input id={`${id}-whatsapp`} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(00) 00000-0000" value={v.whatsapp} aria-invalid={!!erros.whatsapp} onChange={(e) => setV({ ...v, whatsapp: mascara(e.target.value) })} className={classe('whatsapp')} />
        {erro('whatsapp')}
      </div>
      <div>
        {rotulo('area')}
        <div className="relative">
          <select id={`${id}-area`} value={v.area} aria-invalid={!!erros.area} onChange={(e) => setV({ ...v, area: e.target.value })} className={classe('area')}>
            <option value="" disabled className="bg-branco text-tinta">{t.areaPlaceholder}</option>
            {t.areas.map((a) => <option key={a} value={a} className="bg-branco text-tinta">{a}</option>)}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sobre-azul-3">▾</span>
        </div>
        {erro('area')}
      </div>
      <div>
        {rotulo('portfolio')}
        <input id={`${id}-portfolio`} type="url" inputMode="url" value={v.portfolio} onChange={(e) => setV({ ...v, portfolio: e.target.value })} className={classe('portfolio')} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="botao botao-principal w-full sm:w-auto">
          <span>{t.botao}</span>
          <Icone nome="arrow-right" />
        </button>
        <p className="mt-3 text-xs text-sobre-azul-3">{t.nota}</p>
      </div>
    </form>
  );
}
