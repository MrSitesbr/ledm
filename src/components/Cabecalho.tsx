'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import comum from '@/content/comum.json';
import { Logo } from './Logo';
import { Icone } from './Icone';

/**
 * Cabeçalho fixo, tema Plantão.
 * O menu completo aparece a partir de 1360px (antes disso, gaveta). O botão amarelo só aparece depois que o botão da primeira dobra (#cta-dobra) sai da tela.
 * Em páginas sem esse botão, aparece sempre. No celular o menu vira gaveta e o botão fica fora dela.
 */
export function Cabecalho({ semMenu = false }: { semMenu?: boolean }) {
  const [aberto, setAberto] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const alvo = document.getElementById('cta-dobra');
    if (!alvo) {
      setMostrarBotao(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => setMostrarBotao(!e.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [aberto]);

  return (
    <header className="tema-plantao sticky top-0 z-50 border-b border-linha-azul" style={{ background: 'var(--color-azul-plantao)' }}>
      <div className="container-site flex h-[4.5rem] items-center gap-6">
        <Logo fundo="escuro" altura={34} />

        {!semMenu && (
          <nav aria-label="Principal" className="ml-auto hidden min-[1360px]:block">
            <ul className="flex items-center gap-1">
              {comum.menu.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-botao)] px-2.5 font-[family-name:var(--font-titulo)] text-[0.82rem] whitespace-nowrap font-bold tracking-[0.04em] text-sobre-azul-2 transition-colors hover:text-sobre-azul"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {!semMenu && (
          <div className={`ml-auto flex items-center gap-2 min-[1360px]:ml-2`}>
            <Link
              href="/#contato"
              className={`botao botao-principal !min-h-11 !px-4 whitespace-nowrap max-[420px]:!px-3 max-[420px]:!text-[0.72rem] transition-opacity duration-300 ${
                mostrarBotao ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
              }`}
              aria-hidden={!mostrarBotao}
              tabIndex={mostrarBotao ? undefined : -1}
            >
              <span className="max-[560px]:hidden">{comum.botaoPrincipal}</span>
              <span className="min-[561px]:hidden">{comum.botaoPrincipalCurto}</span>
            </Link>
            <button
              ref={botaoMenu}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-botao)] border border-linha-azul text-sobre-azul min-[1360px]:hidden"
              aria-expanded={aberto}
              aria-controls="menu-gaveta"
              aria-label={aberto ? comum.menuFechar : comum.menuAbrir}
              onClick={() => setAberto((v) => !v)}
            >
              <Icone nome={aberto ? 'close' : 'menu'} />
            </button>
          </div>
        )}
      </div>

      {!semMenu && (
        <nav
          id="menu-gaveta"
          aria-label="Principal no celular"
          hidden={!aberto}
          className="border-t border-linha-azul min-[1360px]:hidden"
          style={{ background: 'var(--color-azul-noite)' }}
        >
          <ul className="container-site flex flex-col py-3">
            {comum.menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-12 items-center border-b border-linha-azul font-[family-name:var(--font-titulo)] text-base font-bold text-sobre-azul"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
