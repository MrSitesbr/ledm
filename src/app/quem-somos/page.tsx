import type { Metadata } from 'next';
import Image from 'next/image';
import q from '@/content/quem-somos.json';
import comum from '@/content/comum.json';
import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { Botao, Rotulo } from '@/components/Botao';
import { Icone, type NomeIcone } from '@/components/Icone';
import { Palavras } from '@/components/Palavras';
import { SecaoWalter } from '@/components/SecaoWalter';
import { FormularioEquipe } from '@/components/FormularioEquipe';
import { Efeitos } from '@/components/Efeitos';

export const metadata: Metadata = {
  title: { absolute: q.seo.titulo },
  description: q.seo.descricao,
  alternates: { canonical: '/quem-somos' },
  openGraph: { title: q.seo.titulo, description: q.seo.descricao, url: '/quem-somos' },
};

const titulo = 'font-[family-name:var(--font-titulo)] font-black tracking-[-0.03em]';
const h2 = `${titulo} text-[clamp(1.8rem,3.6vw,2.75rem)] leading-[1.08]`;

export default function QuemSomos() {
  const { dobra, equipe, cultura, trabalhe } = q;
  return (
    <>
      <Cabecalho />
      <main id="conteudo">
        {/* Abertura */}
        <section className="tema-plantao">
          <div className="container-site py-16 text-center sm:py-24">
            <Rotulo className="text-sobre-azul-2">{dobra.rotulo}</Rotulo>
            <h1 data-palavras className={`${titulo} mx-auto mt-6 max-w-[22ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.06]`}>
              <Palavras texto={dobra.titulo} />
            </h1>
            <p data-revelar className="mx-auto mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-sobre-azul-2">{dobra.texto}</p>
            <Botao id="cta-dobra" href="/reuniao" className="mt-9">{comum.botaoPrincipal}</Botao>
          </div>
        </section>

        {/* Fundador */}
        <SecaoWalter rotulo={q.walterRotulo} />

        {/* Equipe: foto única + funções */}
        <section className="tema-nevoa bloco border-t border-linha-clara">
          <div className="container-site">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <Rotulo className="text-tinta-3">{equipe.rotulo}</Rotulo>
                <h2 data-palavras className={`${h2} mt-5`}><Palavras texto={equipe.titulo} /></h2>
                <p data-revelar className="mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-tinta-2">{equipe.texto}</p>
              </div>
              <div data-revelar className="relative aspect-[16/10] overflow-hidden rounded-[28px]">
                <Image src={equipe.imagem} alt={equipe.imagemAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {equipe.funcoes.map((f, i) => (
                <li key={f.titulo} data-revelar style={{ ['--atraso' as string]: `${(i % 4) * 0.06}s` }} className="rounded-[var(--radius-cartao)] bg-branco p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-azul-plantao text-amarelo">
                    <Icone nome={f.icone as NomeIcone} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-titulo)] text-lg font-extrabold leading-tight">{f.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-tinta-2">{f.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cultura */}
        <section className="tema-plantao bloco">
          <div className="container-site">
            <Rotulo className="text-center text-sobre-azul-2">{cultura.rotulo}</Rotulo>
            <h2 data-palavras className={`${h2} mx-auto mt-5 max-w-[20ch] text-center`}><Palavras texto={cultura.titulo} /></h2>
            <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cultura.valores.map((v, i) => (
                <li key={v.titulo} data-revelar style={{ ['--atraso' as string]: `${i * 0.08}s` }} className="relative overflow-hidden rounded-[var(--radius-cartao)] border border-linha-azul p-6" >
                  <span aria-hidden="true" className={`${titulo} absolute -right-1 -bottom-5 text-[5.5rem] leading-none text-white/5`}>{String(i + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true" className="block h-1 w-10 rounded-full" style={{ background: 'var(--grad-luz)' }} />
                  <h3 className="mt-5 font-[family-name:var(--font-titulo)] text-xl font-extrabold">{v.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sobre-azul-2">{v.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Faça parte da equipe */}
        <section id="trabalhe" className="container-site py-6">
          <div className="tema-plantao grid gap-10 rounded-[28px] p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <Rotulo className="text-sobre-azul-2">{trabalhe.rotulo}</Rotulo>
              <h2 data-palavras className={`${h2} mt-5`}><Palavras texto={trabalhe.titulo} /></h2>
              <p className="mt-5 max-w-[46ch] leading-relaxed text-sobre-azul-2">{trabalhe.texto}</p>
            </div>
            <FormularioEquipe />
          </div>
        </section>
      </main>
      <Rodape />
      <Efeitos />
    </>
  );
}
