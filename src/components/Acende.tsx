'use client';

import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

/**
 * O único movimento do site: o amarelo acende sobre o item resolvido quando ele entra na tela, uma vez.
 * `tipo` escolhe o que acende: o texto, um fundo sobre o azul ou uma faixa sobre o claro.
 */
export function Acende({
  children,
  tipo = 'texto',
  as: Tag = 'span',
  className = '',
}: {
  children?: ReactNode;
  tipo?: 'texto' | 'fundo' | 'faixa';
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('aceso');
          obs.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`acende acende-${tipo} ${className}`}>
      {children}
    </Tag>
  );
}
