import Image from 'next/image';
import inicio from '@/content/inicio.json';
import comum from '@/content/comum.json';
import { Botao, Rotulo } from '@/components/Botao';
import { Icone } from '@/components/Icone';
import { Palavras } from '@/components/Palavras';
import { Duvidas } from '@/components/Duvidas';
import { FormularioTeste } from '@/components/FormularioTeste';
import { ChatWhatsApp, type TextosChat } from '@/components/ChatWhatsApp';
import { opcoes } from '@/lib/dados';

const titulo = 'font-[family-name:var(--font-titulo)] font-black tracking-[-0.03em]';
const h2Grande = `${titulo} text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05]`;
const vidro = 'border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_1.5rem_4rem_-1rem_rgb(0_0_0/0.6)]';

const brilhos = [
  'radial-gradient(at 50% 120%, #1A2A8A 0%, #0A1240 50%, #070B26 100%)',
  'radial-gradient(at 50% 120%, rgb(255 204 0 / 0.28) 0%, #0A1240 50%, #070B26 100%)',
  'radial-gradient(at 20% 120%, #1A2A8A 0%, #0A1240 50%, #070B26 100%)',
  'radial-gradient(at 80% 120%, rgb(255 204 0 / 0.22) 0%, #0A1240 50%, #070B26 100%)',
];

/* Cases · Aura "showcase": cartões escuros que grudam no topo e se empilham.
   O de baixo encolhe, gira e desfoca enquanto o próximo passa por cima. */
export function Cases() {
  const c = inicio.cases;
  return (
    <section id="cases" className="tema-nevoa pt-[var(--bloco)]" aria-labelledby="titulo-cases">
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{c.rotulo}</Rotulo>
        <h2 id="titulo-cases" data-palavras className={`${h2Grande} mx-auto mt-5 max-w-[20ch] text-center`}>
          <Palavras texto={c.titulo} />
        </h2>
        {!opcoes.casesProntos && (
          <p className="mt-6 text-center">
            <span className="rotulo inline-flex rounded-full border border-dashed border-tinta-3 px-4 py-2 text-tinta-2">{c.rascunho}</span>
          </p>
        )}
      </div>

      <div className="container-site mt-12">
        {c.itens.map((it, i) => {
          const ultimo = i === c.itens.length - 1;
          const lista = (rotulo: string, itens: string[] | string) => (
            <div>
              <dt className="rotulo !text-[0.7rem] text-sobre-azul-3">{rotulo}</dt>
              <dd className="mt-1.5 grid gap-0.5 text-sm leading-snug text-sobre-azul">
                {(Array.isArray(itens) ? itens : [itens]).map((x) => <span key={x}>{x}</span>)}
              </dd>
            </div>
          );
          return (
            <div key={it.nome} className={ultimo ? 'pb-[var(--bloco)]' : 'lg:h-[115vh]'}>
              {/* Case de portfólio em 4 áreas: descrição · celular + notebook (sobrepostos) · informações */}
              <article
                data-pilha
                className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[28px] p-7 text-sobre-azul max-lg:mb-6 sm:p-10 lg:sticky lg:top-24 lg:min-h-[34rem] lg:grid-cols-[26fr_54fr_20fr] lg:gap-6"
                style={{ background: 'linear-gradient(160deg, #0A1240 0%, #070B26 100%)' }}
              >
                {/* 01 · Descrição */}
                <div className="relative">
                  <h3 className={`${titulo} flex items-baseline gap-3 text-[clamp(2rem,3.1vw,3rem)] leading-[1.02]`}>
                    <span className="numeros text-sm font-bold tracking-normal text-sobre-azul-3">{String(i + 1).padStart(2, '0')}</span>
                    <span>{it.nome}</span>
                  </h3>
                  {it.destaque && <p className="mt-4 font-[family-name:var(--font-titulo)] font-bold leading-snug text-amarelo">{it.destaque}</p>}
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-sobre-azul-2">{it.resumo}</p>
                </div>

                {/* 02 + 03 · Mockups soltos: notebook maior, celular à frente invadindo o notebook */}
                <div className="relative mx-auto grid w-full max-w-[40rem] grid-cols-[20fr_80fr] items-end">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-[10%] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgb(26 42 138 / 0.55), transparent 70%)' }} />
                  <div data-parallax="peca" data-velocidade="0.1" className="relative z-10 -mr-[60%] mb-[-6%]">
                    <Image src={it.mobile} alt={it.mobileAlt} width={it.mobileTam[0]} height={it.mobileTam[1]} sizes="(min-width: 1024px) 12vw, 30vw" className="h-auto w-full -rotate-[4deg] drop-shadow-[0_1.5rem_2rem_rgb(0_0_0/0.55)]" />
                  </div>
                  <div data-parallax="peca" data-velocidade="0.04" className="relative">
                    <Image src={it.desktop} alt={it.desktopAlt} width={it.desktopTam[0]} height={it.desktopTam[1]} sizes="(min-width: 1024px) 34vw, 70vw" className="h-auto w-full drop-shadow-[0_1.5rem_2.5rem_rgb(0_0_0/0.5)]" />
                  </div>
                </div>

                {/* 04 · Informações */}
                <dl className="relative grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                  {lista(c.metaSegmento, it.segmento)}
                  {lista(c.metaFizemos, it.fizemos)}
                  {lista(c.metaEntrega, it.entrega)}
                </dl>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* Como trabalhamos · Aura "Workflow": linha com três etapas e faixa gigante rolando. */
export function ComoTrabalhamos() {
  const c = inicio.comoTrabalhamos;
  const palavras = [...inicio.faixa2, ...inicio.faixa2];
  return (
    <section id="como-trabalhamos" className="tema-nevoa overflow-hidden pb-[var(--bloco)]" aria-label={c.rotulo}>
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{c.rotulo}</Rotulo>
        <ol className="mt-10 grid grid-cols-3 border-t border-linha-clara pt-5 text-sm font-semibold">
          {c.etapas.map((e, i) => (
            <li key={e} className={`flex items-center gap-2 ${i === 1 ? 'justify-center' : i === 2 ? 'justify-end' : ''}`}>
              {i === 1 && <span aria-hidden="true" className="size-2 rounded-full" style={{ background: 'var(--grad-luz)' }} />}
              <span className={i === 1 ? 'text-tinta' : 'text-tinta-3'}>{e}</span>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden="true" className="mt-10 overflow-hidden">
        <p className={`marquee-a flex w-max ${titulo} text-[clamp(3.5rem,11vw,8.5rem)] leading-none whitespace-nowrap text-azul-plantao`}>
          {palavras.map((p, i) => (
            <span key={i} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
              <span className="size-[0.32em] shrink-0 rounded-[0.06em]" style={{ background: 'var(--grad-luz)' }} />
              {p}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* Plantão com IA · Aura "Build Loop": palavra gigante esmaecida, cartão com janela de sistema
   e selo girando à esquerda, passos à direita. */
export function Plantao() {
  const p = inicio.plantao;
  return (
    <section className="tema-nevoa relative overflow-hidden pb-[var(--bloco)]" aria-labelledby="titulo-plantao">
      <p aria-hidden="true" className={`${titulo} pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 text-[clamp(8rem,28vw,22rem)] leading-none text-tinta/[0.05] select-none`}>
        {p.fundo}
      </p>
      <div className="container-site relative grid items-center gap-12 pt-16 lg:grid-cols-2 lg:gap-16">
        <div data-revelar className="relative">
          <div className="rounded-[28px] p-4 sm:p-6" style={{ background: 'var(--grad-luz)' }}>
            <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--color-azul-fundo)' }}>
              <div className="flex items-center justify-between px-4 py-3 text-xs text-sobre-azul-2">
                <span className="font-semibold text-sobre-azul">{p.barra}</span>
                <span className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-amarelo" />{p.estado}</span>
              </div>
              <Image src={p.imagem} alt={p.imagemAlt} width={900} height={600} className="aspect-[16/10] w-full object-cover" />
            </div>
            <div className="mt-4 flex gap-2 text-azul-plantao">
              {(['chat', 'calendar', 'grid', 'chart'] as const).map((n) => (
                <span key={n} className="inline-flex size-9 items-center justify-center rounded-full bg-azul-plantao/10">
                  <Icone nome={n} className="size-4" />
                </span>
              ))}
            </div>
          </div>
          {/* Selo girando */}
          <div aria-hidden="true" className="absolute -right-3 -bottom-6 flex size-28 items-center justify-center rounded-full shadow-xl sm:-right-6" style={{ background: 'var(--color-azul-fundo)' }}>
            <svg viewBox="0 0 100 100" className="selo-gira absolute inset-0 size-full">
              <defs>
                <path id="selo-circulo" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
              </defs>
              <text fill="#ffffff" style={{ fontSize: 8.6, fontFamily: 'var(--font-titulo)', fontWeight: 700 }}>
                <textPath href="#selo-circulo" textLength="224" lengthAdjust="spacing">{p.selo}</textPath>
              </text>
            </svg>
            <Image src="/brand/ledm-simbolo-180.png" alt="" width={36} height={36} />
          </div>
        </div>

        <div>
          <Rotulo className="text-tinta-3">{p.rotulo}</Rotulo>
          <h2 id="titulo-plantao" data-palavras className={`${h2Grande} mt-5`}>
            <Palavras texto={p.titulo} />
          </h2>
          <p data-revelar className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-tinta-2">{p.texto}</p>
          <ol className="mt-8 border-t border-linha-clara">
            {p.passos.map((passo, i) => (
              <li key={passo} data-revelar style={{ ['--atraso' as string]: `${i * 0.08}s` }} className="flex items-center justify-between gap-6 border-b border-linha-clara py-4">
                <span className="font-semibold">{passo}</span>
                <span className="text-xs text-tinta-3">{p.passoRotulo} {String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Como começar · Aura "pricing": cartões claros e cartão escuro com brilho no meio. Sem valores. */
export function Comecar() {
  const c = inicio.comecar;
  return (
    <section className="tema-nevoa bloco" aria-labelledby="titulo-comecar">
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{c.rotulo}</Rotulo>
        <h2 id="titulo-comecar" data-palavras className={`${h2Grande} mx-auto mt-5 max-w-[20ch] text-center`}>
          <Palavras texto={c.titulo} />
        </h2>
        <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {c.opcoes.map((o, i) => (
            <article
              key={o.nome}
              /* 3º cartão: ocupa a linha inteira no tablet (2 colunas) */
              data-revelar
              style={{
                ['--atraso' as string]: `${i * 0.12}s`,
                ...(o.destaque ? { background: 'radial-gradient(at 50% 120%, rgb(255 204 0 / 0.22) 0%, #0A1240 45%, #070B26 100%)', boxShadow: '0 2rem 6rem -1.5rem rgb(17 29 102 / 0.55)' } : {}),
              }}
              className={`flex flex-col rounded-[28px] p-8 sm:p-10 lg:p-8 ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''} ${o.destaque ? 'text-sobre-azul' : 'border border-linha-clara bg-branco'}`}
            >
              <span className={`inline-flex size-11 items-center justify-center rounded-xl ${o.destaque ? 'border border-linha-azul' : 'bg-azul-plantao text-branco'}`}>
                <Icone nome={o.icone as 'chat' | 'grid' | 'clipboard'} className="size-5" />
              </span>
              <h3 className="mt-8 font-[family-name:var(--font-titulo)] text-[1.75rem] leading-tight font-black tracking-[-0.02em]">{o.nome}</h3>
              <p className={`mt-3 ${o.destaque ? 'text-sobre-azul-2' : 'text-tinta-2'}`}>{o.texto}</p>
              <ul className="mt-6 mb-8 grid gap-3">
                {o.itens.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <Icone nome="check" className={`size-5 shrink-0 ${o.destaque ? 'text-amarelo' : 'text-tinta'}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <div className={`mt-auto flex flex-wrap items-end justify-between gap-4 border-t pt-6 ${o.destaque ? 'border-linha-azul' : 'border-linha-clara'}`}>
                <div>
                  <p className={`text-xs ${o.destaque ? 'text-sobre-azul-3' : 'text-tinta-3'}`}>{c.idealPara}</p>
                  <p className="font-semibold">{o.para}</p>
                </div>
                <Botao href="#contato" variante={o.destaque ? 'principal' : 'secundario'} className="!min-h-11 !px-4">{'botao' in o ? o.botao : comum.botaoPrincipal}</Botao>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-tinta-3">{c.nota}</p>
      </div>
    </section>
  );
}

/* Dúvidas · Aura: título central e perguntas em duas colunas. */
export function BlocoDuvidas() {
  const d = inicio.duvidas;
  return (
    <section id="duvidas" className="tema-nevoa bloco" aria-labelledby="titulo-duvidas">
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{d.rotulo}</Rotulo>
        <h2 id="titulo-duvidas" data-palavras className={`${h2Grande} mt-5 text-center`}>
          <Palavras texto={d.titulo} />
        </h2>
        <p className="mt-4 mb-12 text-center text-tinta-3">{d.texto}</p>
        <Duvidas />
      </div>
    </section>
  );
}

/* Chamada final · Aura: painel com foto, texto à esquerda, formulário de vidro à direita
   e faixa rolando no pé do painel. */
export function ChamadaFinal() {
  const f = inicio.final;
  const palavras = [...inicio.faixa2, ...inicio.faixa2, ...inicio.faixa2];
  return (
    <section id="contato" className="container-site pt-4 pb-6" aria-labelledby="titulo-final">
      <div className="relative overflow-hidden rounded-[28px] text-sobre-azul">
        <Image src={f.imagem} alt="" fill sizes="(min-width: 1200px) 1184px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgb(7 11 38 / 0.92) 25%, rgb(10 18 64 / 0.7) 60%, rgb(7 11 38 / 0.85))' }} />
        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-16">
          <div className="flex flex-col justify-end">
            <h2 id="titulo-final" data-palavras className={`${titulo} text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05]`}>
              <Palavras texto={f.titulo} />
            </h2>
            <p data-revelar className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-sobre-azul-2">{f.texto}</p>
          </div>
          <div className={`rounded-2xl p-6 sm:p-8 ${vidro}`}>
            <FormularioTeste />
          </div>
        </div>
        <div aria-hidden="true" className="relative overflow-hidden border-t border-white/10 py-3">
          <p className="marquee-b flex w-max text-sm whitespace-nowrap text-sobre-azul-3">
            {palavras.map((p, i) => (
              <span key={i} className="flex shrink-0 items-center gap-4 pr-4">
                {p}
                <span className="size-1.5 rounded-[2px] bg-amarelo" />
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/* Assistente SDR com IA · duas colunas: explicação à esquerda, conversa simulada no WhatsApp à direita. */
export function AssistenteSdr() {
  const s = inicio.sdr;
  return (
    <section id="assistente-sdr" className="tema-plantao overflow-hidden" style={{ paddingBlock: 'calc(var(--bloco) * 0.9)' }} aria-labelledby="titulo-sdr">
      {/* Tudo 10% menor (zoom 0.9) */}
      <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20" style={{ zoom: 0.9 }}>
        <div>
          <Rotulo className="text-sobre-azul-2">{s.rotulo}</Rotulo>
          <h2 id="titulo-sdr" data-palavras className={`${titulo} mt-5 max-w-[22ch] text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.15]`}>
            <Palavras texto={s.titulo} />
          </h2>
          <p data-revelar className="mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-sobre-azul-2">{s.texto}</p>
          <ul className="mt-8 grid gap-3">
            {s.pontos.map((p, i) => (
              <li key={p} data-revelar style={{ ['--atraso' as string]: `${i * 0.08}s` }} className="flex items-start gap-3 rounded-xl border border-linha-azul px-4 py-3.5" >
                <Icone nome="check" className="mt-0.5 size-5 shrink-0 text-amarelo" />
                <span className="text-sobre-azul">{p}</span>
              </li>
            ))}
          </ul>
          <Botao href="#contato" className="mt-10 w-full sm:w-auto">{comum.botaoPrincipal}</Botao>
        </div>
        <div data-revelar style={{ ['--atraso' as string]: '0.2s' }}>
          <ChatWhatsApp textos={s as unknown as TextosChat} />
        </div>
      </div>
    </section>
  );
}
