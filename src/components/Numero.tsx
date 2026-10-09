import { milhar, brl } from '@/lib/dados';
import comum from '@/content/comum.json';
import { Acende } from './Acende';

/**
 * Número principal: "R$" e "por mês" menores, colados ao valor; "no mínimo" colado logo abaixo.
 * Sobre o azul, o valor acende em amarelo. Sobre o claro, fica no azul da marca.
 */
export function NumeroPrincipal({
  valor,
  minimo,
  tamanho = 'grande',
  sobre = 'azul',
  acende = true,
}: {
  valor: number;
  minimo?: number;
  tamanho?: 'gigante' | 'grande' | 'medio';
  sobre?: 'azul' | 'claro';
  acende?: boolean;
}) {
  const fonte = {
    gigante: 'text-[clamp(3.4rem,13vw,7.5rem)]',
    grande: 'text-[clamp(2.6rem,8vw,4.5rem)]',
    medio: 'text-[clamp(2rem,5vw,2.6rem)]',
  }[tamanho];

  const valorEl = (
    <span className={`numeros font-[family-name:var(--font-titulo)] font-extrabold leading-none tracking-[-0.02em] ${fonte}`}>
      <span className="mr-1 align-[0.55em] text-[0.36em] tracking-normal">R$</span>
      {milhar(valor)}
    </span>
  );

  const corSecundaria = sobre === 'azul' ? 'text-sobre-azul-2' : 'text-tinta-2';

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3">
        {sobre === 'azul' && acende ? (
          <Acende tipo="texto">{valorEl}</Acende>
        ) : (
          <span className={sobre === 'azul' ? 'text-amarelo' : 'text-tinta'}>{valorEl}</span>
        )}
        <span className={`font-[family-name:var(--font-titulo)] text-base font-bold ${corSecundaria}`}>{comum.porMes}</span>
      </p>
      {minimo !== undefined && (
        <p className={`numeros mt-2 font-[family-name:var(--font-titulo)] text-lg font-bold ${corSecundaria}`}>
          {comum.noMinimo} {brl(minimo)}
        </p>
      )}
    </div>
  );
}

/** Selo ESTIMATIVA / CENÁRIO: pílula com o rótulo escrito. */
export function SeloEstimativa({ sobre = 'azul', texto = comum.estimativa }: { sobre?: 'azul' | 'claro'; texto?: string }) {
  const cor = sobre === 'azul' ? 'border-linha-azul text-sobre-azul-2' : 'border-linha-clara text-tinta-2';
  return (
    <span className={`rotulo inline-flex items-center rounded-full border px-3 py-1.5 ${cor}`}>{texto}</span>
  );
}
