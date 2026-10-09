import { Fragment } from 'react';

/** Título que entra palavra por palavra (efeito do Aura). `inicio` continua a contagem entre trechos do mesmo título. */
export function Palavras({ texto, inicio = 0, className = '' }: { texto: string; inicio?: number; className?: string }) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  return (
    <>
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span className={`palavra ${className}`} style={{ ['--i' as string]: inicio + i }}>{p}</span>
          {i < palavras.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}

export const contarPalavras = (texto: string) => texto.split(/\s+/).filter(Boolean).length;
