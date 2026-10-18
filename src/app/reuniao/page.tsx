import type { Metadata } from 'next';
import Image from 'next/image';
import r from '@/content/reuniao.json';
import { Logo } from '@/components/Logo';
import { Rodape } from '@/components/Rodape';
import { Rotulo, Botao } from '@/components/Botao';
import { Icone, type NomeIcone } from '@/components/Icone';
import { Palavras, contarPalavras } from '@/components/Palavras';
import { FormularioCall } from '@/components/FormularioCall';
import { Efeitos } from '@/components/Efeitos';
import { SecaoWalter } from '@/components/SecaoWalter';

export const metadata: Metadata = {
  title: { absolute: r.seo.titulo },
  description: r.seo.descricao,
  alternates: { canonical: '/reuniao' },
  openGraph: { title: r.seo.titulo, description: r.seo.descricao, url: '/reuniao' },
};

const titulo = 'font-[family-name:var(--font-titulo)] font-black tracking-[-0.03em]';

/* Landing page para campanhas: agendar reunião estratégica com a Led. Sem menu, uma ação só. */
export default function Reuniao() {
  const d = r.dobra;
  const faixa = [...r.faixa, ...r.faixa, ...r.faixa];
  return (
    <>
      <main id="conteudo">
        {/* Primeira dobra: texto à esquerda, formulário em 2 etapas à direita */}
        <section className="tema-plantao relative overflow-hidden">
          <Image src={d.imagem} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, #070B26 30%, rgb(7 11 38 / 0.7) 70%, rgb(7 11 38 / 0.85))' }} />
          <div className="container-site relative grid items-center gap-10 py-10 sm:py-16 lg:min-h-[calc(100svh-3.25rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Logo fundo="escuro" altura={40} link={false} />
              <p className="rotulo mt-8 inline-flex items-center gap-2 rounded-md border border-amarelo/40 px-3 py-2 text-amarelo">
                <span className="size-1.5 rounded-full bg-amarelo" />
                {d.selo}
              </p>
              <h1 data-palavras className={`${titulo} mt-6 text-[clamp(2rem,4.2vw,3.3rem)] leading-[1.08]`}>
                <Palavras texto={d.tituloA} />{' '}
                <Palavras texto={d.tituloB} inicio={contarPalavras(d.tituloA)} className="text-amarelo" />
              </h1>
              <div data-revelar className="mt-6 grid max-w-[54ch] gap-3 text-[1.0625rem] leading-relaxed text-sobre-azul-2">
                {d.textos.map((t) => <p key={t}>{t}</p>)}
              </div>
              <ul data-revelar className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                {d.provas.map((p) => (
                  <li key={p} className="flex items-center gap-2"><Icone nome="check" className="size-4 text-amarelo" />{p}</li>
                ))}
              </ul>
            </div>
            <div id="agendar" data-revelar style={{ ['--atraso' as string]: '0.25s' }}>
              <FormularioCall />
            </div>
          </div>
          {/* Faixa rolando no pé da dobra */}
          <div aria-hidden="true" className="relative overflow-hidden border-t border-linha-azul py-3" style={{ background: '#070B26' }}>
            <p className="marquee-a flex w-max text-xs font-bold tracking-[0.14em] whitespace-nowrap text-sobre-azul-2 uppercase">
              {faixa.map((t, i) => (
                <span key={i} className="flex shrink-0 items-center gap-6 pr-6">{t}<span className="size-1.5 rounded-full bg-amarelo" /></span>
              ))}
            </p>
          </div>
        </section>

        {/* Para quem é */}
        <section className="tema-nevoa bloco">
          <div className="container-site">
            <Rotulo className="text-center text-tinta-3">{r.paraQuem.rotulo}</Rotulo>
            <h2 data-palavras className={`${titulo} mx-auto mt-5 max-w-[24ch] text-center text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1]`}>
              <Palavras texto={r.paraQuem.titulo} />
            </h2>
            <p className="mt-4 text-center text-tinta-3">{r.paraQuem.texto}</p>
            <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              {/* Ilustrações da home: notebook ao fundo, post e vídeo de anúncio à frente */}
              <div data-revelar className="relative mx-auto aspect-[5/4] w-full max-w-xl" role="img" aria-label={r.paraQuem.ilustracoes.alt}>
                <div aria-hidden="true" className="absolute inset-[8%] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgb(17 29 102 / 0.28), transparent 70%)' }} />
                <div data-parallax="peca" data-velocidade="0.04" className="absolute top-[6%] left-[10%] w-[80%]">
                  <Image src={r.paraQuem.ilustracoes.notebook} alt="" width={1100} height={757} sizes="(min-width: 1024px) 36vw, 80vw" className="h-auto w-full drop-shadow-[0_1.5rem_2.5rem_rgb(0_0_0/0.35)]" />
                </div>
                <div data-parallax="peca" data-velocidade="0.1" className="absolute bottom-0 left-0 w-[34%]">
                  <Image src={r.paraQuem.ilustracoes.post} alt="" width={800} height={1001} sizes="(min-width: 1024px) 15vw, 34vw" className="h-auto w-full -rotate-[7deg] drop-shadow-[0_1.5rem_2rem_rgb(0_0_0/0.4)]" />
                </div>
                <div data-parallax="peca" data-velocidade="0.14" className="absolute right-0 bottom-[-4%] w-[30%]">
                  <Image src={r.paraQuem.ilustracoes.video} alt="" width={720} height={1080} sizes="(min-width: 1024px) 13vw, 30vw" className="h-auto w-full rotate-[6deg] drop-shadow-[0_1.5rem_2rem_rgb(0_0_0/0.4)]" />
                </div>
              </div>
              <ul className="grid gap-3">
                {r.paraQuem.itens.map((it, i) => (
                  <li
                    key={it.titulo}
                    data-revelar
                    style={{ ['--atraso' as string]: `${i * 0.06}s` }}
                    className="flex items-start gap-4 rounded-[var(--radius-cartao)] border border-linha-clara bg-branco p-4 shadow-[0_0.75rem_2rem_-1rem_rgb(17_29_102/0.25)] sm:p-5"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-azul-plantao text-amarelo">
                      <Icone nome="check" className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-titulo)] text-lg font-extrabold">{it.titulo}</h3>
                      <p className="mt-0.5 text-tinta-2">{it.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 flex justify-center"><Botao href="#agendar">{r.final.botao}</Botao></div>
          </div>
        </section>

        {/* O que você leva da reunião */}
        <section className="tema-plantao bloco">
          <div className="container-site">
            <Rotulo className="text-center text-sobre-azul-2">{r.recebe.rotulo}</Rotulo>
            <h2 data-palavras className={`${titulo} mx-auto mt-5 max-w-[22ch] text-center text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1]`}>
              <Palavras texto={r.recebe.titulo} />
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-center text-sobre-azul-2">{r.recebe.texto}</p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {r.recebe.itens.map((it, i) => (
                <li key={it.titulo} data-revelar className="relative overflow-hidden rounded-[var(--radius-cartao)] border border-linha-azul p-6" style={{ ['--atraso' as string]: `${i * 0.08}s`, background: 'var(--color-azul-noite)' }}>
                  <span aria-hidden="true" className={`${titulo} absolute -right-2 -bottom-6 text-[6rem] leading-none text-white/5`}>{String(i + 1).padStart(2, '0')}</span>
                  <Icone nome={it.icone as NomeIcone} className="size-7 text-amarelo" />
                  <h3 className="mt-5 font-[family-name:var(--font-titulo)] text-lg font-extrabold">{it.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sobre-azul-2">{it.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SecaoWalter rotulo={r.honesta.rotulo} />

        {/* Chamada final */}
        <section className="container-site pb-6">
          <div className="tema-plantao rounded-[28px] px-6 py-14 text-center sm:px-12">
            <h2 data-palavras className={`${titulo} mx-auto max-w-[20ch] text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.08]`}>
              <Palavras texto={r.final.titulo} />
            </h2>
            <p className="mx-auto mt-4 max-w-[50ch] text-sobre-azul-2">{r.final.texto}</p>
            <Botao href="#agendar" className="mt-8">{r.final.botao}</Botao>
          </div>
        </section>
      </main>
      <Rodape minimo />
      <Efeitos />
    </>
  );
}
