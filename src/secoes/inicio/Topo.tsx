import Image from 'next/image';
import inicio from '@/content/inicio.json';
import comum from '@/content/comum.json';
import { Botao, Rotulo } from '@/components/Botao';
import { Icone, type NomeIcone } from '@/components/Icone';
import { Palavras, contarPalavras } from '@/components/Palavras';
import { SliderFrases } from '@/components/SliderFrases';

const titulo = 'font-[family-name:var(--font-titulo)] font-black tracking-[-0.03em]';
const vidro = 'border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_1.5rem_4rem_-1rem_rgb(0_0_0/0.6)]';

/* Primeira dobra · Aura: selo, título com pílula no meio da frase, dois botões,
   painel de foto com parallax e fragmentos de interface flutuando, abas embaixo. */
export function Dobra() {
  const d = inicio.dobra;
  const c = inicio.conteudo;
  const n1 = contarPalavras(d.tituloAntes);
  const n2 = n1 + 1;
  const n3 = n2 + contarPalavras(d.tituloApagado);
  return (
    <section className="tema-plantao relative overflow-hidden" aria-labelledby="titulo-dobra">
      <div className="container-site flex flex-col items-center pt-10 pb-10 text-center sm:pt-14">
        <p data-revelar className="rotulo inline-flex items-center gap-2.5 rounded-full border border-linha-azul px-4 py-2 text-sobre-azul" style={{ background: 'var(--color-azul-noite)' }}>
          <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: 'var(--grad-luz)' }} />
          {d.rotulo}
        </p>

        <h1 id="titulo-dobra" data-palavras className={`${titulo} mt-6 max-w-[26ch] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.12]`}>
          <Palavras texto={d.tituloAntes} />{' '}
          <span className="palavra mx-[0.08em] -translate-y-[0.06em] rounded-full px-[0.5em] py-[0.12em] align-middle text-[0.78em] whitespace-nowrap text-azul-plantao" style={{ background: 'var(--grad-luz)', ['--i' as string]: n1 }}>
            {d.tituloSelo}
          </span>{' '}
          <Palavras texto={d.tituloApagado} inicio={n2} className="text-sobre-azul-3" /> <Palavras texto={d.tituloFinal} inicio={n3} />
        </h1>

        <p data-revelar className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-sobre-azul-2" style={{ ['--atraso' as string]: '0.4s' }}>{d.subtitulo}</p>

        <div data-revelar className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row" style={{ ['--atraso' as string]: '0.55s' }}>
          <Botao id="cta-dobra" href="#contato" className="w-full sm:w-auto">{comum.botaoPrincipal}</Botao>
          <Botao href="#solucoes" variante="secundario" seta={false} className="w-full sm:w-auto">{d.botaoSecundario}</Botao>
        </div>
      </div>

      {/* Painel "Conteúdo que vende": fundo com parallax, texto e os dois formatos numa única composição */}
      <div className="container-site pb-6">
        <div data-revelar className="relative overflow-hidden rounded-[28px] border border-linha-azul" style={{ ['--atraso' as string]: '0.7s' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-parallax data-velocidade="0.05" src={c.fundo} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgb(7 11 38 / 0.92) 0%, rgb(7 11 38 / 0.7) 45%, rgb(7 11 38 / 0.25) 100%)' }} />

          <div className="relative grid items-center gap-10 p-7 text-left sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:p-14">
            <div>
              <p className="rotulo text-amarelo">{c.rotulo}</p>
              <h2 className="mt-4 font-[family-name:var(--font-titulo)] text-[clamp(1.8rem,3vw,2.55rem)] leading-[1.06] font-black tracking-[-0.03em]">
                {c.tituloA} <span className="text-amarelo">{c.tituloB}</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-sobre-azul-2">{c.texto}</p>
              <ul className="mt-8 grid border-t border-linha-azul sm:grid-cols-2">
                {c.itens.map((it, i) => (
                  <li key={it.titulo} className={`flex gap-3 border-b border-linha-azul py-4 ${i % 2 === 0 ? 'sm:pr-5' : 'sm:border-l sm:pl-5'}`}>
                    <Icone nome={it.icone as NomeIcone} className="mt-0.5 size-5 shrink-0 text-amarelo" />
                    <div>
                      <p className="font-[family-name:var(--font-titulo)] text-[0.95rem] font-extrabold leading-tight">{it.titulo}</p>
                      <p className="mt-1 text-sm text-sobre-azul-3">{it.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockups: post 4:5 à frente, thumb 9:16 atrás e à direita */}
            <div className="relative mx-auto grid w-full max-w-[42rem] grid-cols-[1.15fr_0.85fr] items-end gap-2 sm:gap-3">
              <figure className="relative z-10">
                <div data-parallax="peca" data-velocidade="0.08">
                  <Image src={c.post.imagem} alt={c.post.alt} width={800} height={1001} sizes="(min-width: 1024px) 22vw, 50vw" className="h-auto w-full -rotate-[3deg] drop-shadow-[0_1.5rem_2.5rem_rgb(0_0_0/0.55)] lg:scale-[1.06]" />
                </div>
                <figcaption className="mt-4 border-l-2 border-amarelo pl-3">
                  <span className="rotulo block !text-[0.7rem] text-sobre-azul">{c.post.rotulo}</span>
                  <span className="text-xs text-sobre-azul-3">{c.post.formato}</span>
                </figcaption>
              </figure>
              <figure className="relative -ml-6 sm:-ml-10">
                <div data-parallax="peca" data-velocidade="0.18">
                  <Image src={c.video.imagem} alt={c.video.alt} width={720} height={1080} sizes="(min-width: 1024px) 18vw, 40vw" className="h-auto w-full rotate-[3deg] drop-shadow-[0_1.5rem_2.5rem_rgb(0_0_0/0.55)]" />
                </div>
                <figcaption className="mt-4 ml-6 border-l-2 border-amarelo pl-3 sm:ml-10">
                  <span className="rotulo block !text-[0.7rem] text-sobre-azul">{c.video.rotulo}</span>
                  <span className="text-xs text-sobre-azul-3">{c.video.formato}</span>
                </figcaption>
              </figure>
              <p className="col-span-2 text-right text-[0.7rem] text-sobre-azul-3">{c.aviso}</p>
            </div>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 pb-6 text-sm font-medium text-sobre-azul-3" aria-label="O que fazemos">
          {d.abas.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* Faixas inclinadas do Aura, rolando em sentidos opostos. */
export function Faixas() {
  const faixa = (palavras: string[], estilo: 'luz' | 'noite', giro: string, pos: string, sentido: 'a' | 'b') => {
    const lista = [...palavras, ...palavras, ...palavras, ...palavras];
    return (
      <div
        className={`absolute left-[-10%] w-[120%] py-3.5 sm:py-4 ${giro} ${pos}`}
        style={{ background: estilo === 'luz' ? 'var(--grad-luz)' : 'var(--color-azul-noite)' }}
      >
        <p className={`marquee-${sentido} flex w-max font-[family-name:var(--font-titulo)] text-[clamp(1rem,2.2vw,1.5rem)] font-extrabold whitespace-nowrap ${estilo === 'luz' ? 'text-azul-plantao' : 'text-sobre-azul'}`}>
          {lista.map((p, i) => (
            <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
              {p}
              <span className={`size-2 shrink-0 rounded-[2px] ${estilo === 'luz' ? 'bg-azul-plantao' : 'bg-amarelo'}`} />
            </span>
          ))}
        </p>
      </div>
    );
  };
  return (
    <div aria-hidden="true" className="relative h-40 overflow-hidden sm:h-52" style={{ background: 'var(--color-nevoa)' }}>
      {faixa(inicio.faixa, 'luz', 'rotate-[3deg]', 'top-12 sm:top-16', 'a')}
      {faixa(inicio.faixa2, 'noite', '-rotate-[4deg]', 'top-14 sm:top-20', 'b')}
    </div>
  );
}

/* Manifesto · Aura: rótulo "( … )" e frase grande centralizada, palavra por palavra. */
export function Manifesto() {
  const m = inicio.manifesto;
  return (
    <section id="quem-somos" className="tema-nevoa bloco" aria-labelledby="titulo-manifesto">
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{m.rotulo}</Rotulo>
        <h2 id="titulo-manifesto" data-palavras className={`${titulo} mx-auto mt-6 max-w-[30ch] text-center text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.12] font-extrabold tracking-[-0.025em]`}>
          <Palavras texto={m.texto} />
        </h2>
      </div>
    </section>
  );
}

/* Por que a Led · Aura: cartão escuro com números que contam + cartão grande com imagem e frases. */
export function PorQue() {
  const p = inicio.porque;
  return (
    <section className="tema-nevoa pb-[var(--bloco)]" aria-label={p.rotulo}>
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{p.rotulo}</Rotulo>
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.42fr_1fr]">
          <div data-revelar className="flex flex-col justify-between gap-2 rounded-[var(--radius-painel)] p-7 text-sobre-azul sm:p-8" style={{ background: 'radial-gradient(at 30% 120%, #1A2A8A 0%, #0A1240 55%, #070B26 100%)' }}>
            {p.numeros.map((n, i) => (
              <div key={n.texto} className={`py-4 ${i ? 'border-t border-linha-azul' : ''}`}>
                <p className="numeros font-[family-name:var(--font-titulo)] text-5xl leading-none font-black">
                  <span data-contar={n.valor}>0</span>
                  {n.sufixo}
                </p>
                <p className="mt-2 text-sm text-sobre-azul-2">{n.texto}</p>
              </div>
            ))}
          </div>
          <div data-revelar style={{ ['--atraso' as string]: '0.15s' }}>
            <SliderFrases frases={p.frases} rotulo={p.sliderRotulo} imagem={p.imagem} anterior={p.anterior} proxima={p.proxima} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* O que fazemos · Aura "Outputs": linhas com área, título central e meta. */
export function Solucoes() {
  const s = inicio.solucoes;
  return (
    <section id="solucoes" className="tema-nevoa bloco" aria-labelledby="titulo-solucoes">
      <div className="container-site">
        <Rotulo className="text-center text-tinta-3">{s.rotulo}</Rotulo>
        <h2 id="titulo-solucoes" data-palavras className={`${titulo} mx-auto mt-5 max-w-[20ch] text-center text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05]`}>
          <Palavras texto={s.titulo} />
        </h2>
        <ul className="mx-auto mt-14 max-w-4xl border-t border-linha-clara">
          {s.itens.map((it, i) => (
            <li
              key={it.titulo}
              data-revelar
              style={{ ['--atraso' as string]: `${i * 0.06}s` }}
              className="group grid grid-cols-1 items-center gap-1 border-b border-linha-clara py-6 text-center transition-colors hover:bg-branco sm:grid-cols-[1fr_2fr_1fr] sm:gap-4 sm:px-4"
            >
              <span className="text-sm text-tinta-3 sm:text-left">{it.area}</span>
              <span className="font-[family-name:var(--font-titulo)] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight font-extrabold">{it.titulo}</span>
              <span className="text-sm text-tinta-3 sm:text-right">{it.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
