import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icone } from './Icone';

type Props = {
  href: string;
  children: ReactNode;
  variante?: 'principal' | 'secundario';
  seta?: boolean;
  className?: string;
  externo?: boolean;
  id?: string;
};

export function Botao({ href, children, variante = 'principal', seta = true, className = '', externo, id }: Props) {
  const classe = `botao botao-${variante} ${className}`;
  const conteudo = (
    <>
      <span>{children}</span>
      {seta && <Icone nome="arrow-right" />}
    </>
  );
  if (externo) {
    return (
      <a id={id} href={href} className={classe} target="_blank" rel="noopener noreferrer">
        {conteudo}
      </a>
    );
  }
  return (
    <Link id={id} href={href} className={classe}>
      {conteudo}
    </Link>
  );
}

export function LinkSeta({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-seta ${className}`}>
      <span>{children}</span>
      <Icone nome="arrow-right" />
    </Link>
  );
}

/** Rótulo no estilo do Aura: "( RÓTULO )". Caixa alta, até 3 palavras. */
export function Rotulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rotulo ${className}`}>
      <span aria-hidden="true">( </span>
      {children}
      <span aria-hidden="true"> )</span>
    </p>
  );
}
