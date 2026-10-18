'use client';

import { useId, useState, type FormEvent } from 'react';
import comum from '@/content/comum.json';
import { empresa, whatsappLink } from '@/lib/dados';
import { registrarEvento } from '@/lib/medicao';
import { Icone } from './Icone';

const f = comum.formulario;
type Campo = 'nome' | 'whatsapp' | 'empresa' | 'tipo' | 'cidade';
type Valores = Record<Campo, string>;

/** (00) 00000-0000 */
function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function montarMensagem(v: Valores, origem?: string) {
  let msg = f.mensagem
    .replace('[nome]', v.nome.trim())
    .replace('[empresa]', v.empresa.trim())
    .replace('[tipo]', v.tipo)
    .replace('[cidade]', v.cidade)
    .replace('[whatsapp]', v.whatsapp);
  if (origem) msg += ` ${f.origem.replace('[utm_source]', origem)}`;
  return msg;
}

/** Não envia nada a servidor e não guarda dados: valida no navegador e abre o wa.me em nova aba. */
export function FormularioTeste({ textoBotao = comum.botaoPrincipal }: { textoBotao?: string } = {}) {
  const id = useId();
  const [v, setV] = useState<Valores>({ nome: '', whatsapp: '', empresa: '', tipo: '', cidade: '' });
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});

  const validar = () => {
    const e: Partial<Record<Campo, string>> = {};
    if (!v.nome.trim()) e.nome = f.erros.nome;
    if (v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = f.erros.whatsapp;
    if (!v.empresa.trim()) e.empresa = f.erros.empresa;
    if (!v.tipo) e.tipo = f.erros.tipo;
    if (!v.cidade) e.cidade = f.erros.cidade;
    return e;
  };

  const enviar = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const origem = new URLSearchParams(window.location.search).get('utm_source') ?? undefined;
    registrarEvento('pedido_teste', { cidade: v.cidade, tipo: v.tipo });
    window.open(whatsappLink(montarMensagem(v, origem)), '_blank', 'noopener,noreferrer');
  };

  const classe = (campo: Campo) =>
    `w-full min-h-12 rounded-[var(--radius-botao)] border bg-white/5 px-4 py-3 text-base text-sobre-azul backdrop-blur placeholder:text-sobre-azul-3 outline-none focus:border-amarelo ${
      erros[campo] ? 'border-2 border-sobre-azul' : 'border-linha-azul'
    }`;

  const props = (campo: Campo) => ({
    id: `${id}-${campo}`,
    value: v[campo],
    'aria-invalid': !!erros[campo],
    'aria-describedby': erros[campo] ? `${id}-${campo}-erro` : undefined,
    className: classe(campo),
  });

  const rotulo = (campo: Campo) => (
    <label htmlFor={`${id}-${campo}`} className="rotulo mb-2 block !text-[0.72rem] text-sobre-azul-2">
      {f.campos[campo]}
    </label>
  );

  const erro = (campo: Campo) =>
    erros[campo] ? (
      <p id={`${id}-${campo}-erro`} className="mt-2 flex items-center gap-2 text-sm font-semibold text-sobre-azul">
        <Icone nome="info" className="size-4 shrink-0" />
        {erros[campo]}
      </p>
    ) : null;

  const seta = (
    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sobre-azul-3">▾</span>
  );

  return (
    <form noValidate onSubmit={enviar} className="grid gap-5">
      <div>
        {rotulo('nome')}
        <input {...props('nome')} autoComplete="name" onChange={(e) => setV({ ...v, nome: e.target.value })} />
        {erro('nome')}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          {rotulo('whatsapp')}
          <input
            {...props('whatsapp')}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={f.whatsappPlaceholder}
            onChange={(e) => setV({ ...v, whatsapp: mascaraTelefone(e.target.value) })}
          />
          {erro('whatsapp')}
        </div>
        <div>
          {rotulo('empresa')}
          <input {...props('empresa')} autoComplete="organization" onChange={(e) => setV({ ...v, empresa: e.target.value })} />
          {erro('empresa')}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          {rotulo('tipo')}
          <div className="relative">
            <select {...props('tipo')} className={`${classe('tipo')} appearance-none`} onChange={(e) => setV({ ...v, tipo: e.target.value })}>
              <option value="" disabled className="bg-branco text-tinta">{f.tipoPlaceholder}</option>
              {f.tipos.map((t) => <option key={t} value={t} className="bg-branco text-tinta">{t}</option>)}
            </select>
            {seta}
          </div>
          {erro('tipo')}
        </div>
        <div>
          {rotulo('cidade')}
          <div className="relative">
            <select {...props('cidade')} className={`${classe('cidade')} appearance-none`} onChange={(e) => setV({ ...v, cidade: e.target.value })}>
              <option value="" disabled className="bg-branco text-tinta">{f.cidadePlaceholder}</option>
              {empresa.cidadesFormulario.map((c) => <option key={c} value={c} className="bg-branco text-tinta">{c}</option>)}
            </select>
            {seta}
          </div>
          {erro('cidade')}
        </div>
      </div>
      <div>
        <button type="submit" className="botao botao-principal w-full">
          <span>{textoBotao}</span>
          <Icone nome="arrow-right" />
        </button>
        <p className="mt-4 flex gap-2 text-sm text-sobre-azul-2">
          <Icone nome="lock" className="mt-0.5 size-4 shrink-0" />
          {f.nota}
        </p>
      </div>
    </form>
  );
}
