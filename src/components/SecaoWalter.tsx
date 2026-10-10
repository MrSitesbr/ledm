import Image from 'next/image';
import r from '@/content/reuniao.json';
import { Rotulo } from './Botao';
import { Palavras } from './Palavras';

const titulo = 'font-[family-name:var(--font-titulo)] font-black tracking-[-0.03em]';

/** Seção sobre o Walter: usada na landing /reuniao e na página Quem somos. Textos em reuniao.json ("honesta"). */
export function SecaoWalter({ rotulo }: { rotulo: string }) {
  const w = r.honesta;
  return (
    <section className="tema-nevoa overflow-hidden">
      <div className="container-site grid items-center gap-8 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14 lg:py-20">
        {/* A foto acompanha a altura do texto e é recortada (object-cover), sem estourar a seção */}
        <div data-revelar className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-[28px] lg:max-w-[22rem]">
          <Image src={w.foto} alt={w.fotoAlt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
        </div>
        <div>
          <Rotulo className="text-tinta-3">{rotulo}</Rotulo>
          <h2 data-palavras className={`${titulo} mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05]`}>
            <Palavras texto={w.nome} />
          </h2>
          <p className="mt-2 font-[family-name:var(--font-titulo)] font-bold text-tinta-2">{w.cargo}</p>
          <div data-revelar className="mt-5 grid gap-3 text-[0.95rem] leading-relaxed text-tinta-2">
            {w.paragrafos.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p data-revelar className="mt-6 flex gap-3 rounded-[var(--radius-cartao)] bg-azul-plantao p-5 font-[family-name:var(--font-titulo)] font-bold leading-snug text-sobre-azul">
            <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-[3px]" style={{ background: 'var(--grad-luz)' }} />
            {w.destaque}
          </p>
        </div>
      </div>
    </section>
  );
}
