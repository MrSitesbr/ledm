'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import comum from '@/content/comum.json';
import { medicao } from '@/lib/dados';

const CHAVE = 'ledm-consentimento-medicao';
type Escolha = 'aceitou' | 'recusou' | null;

function lerEscolha(): Escolha {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === 'aceitou' || v === 'recusou' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Meta Pixel com aviso de cookies (LGPD).
 * - Sem `medicao.metaPixelId` em site.json: não mostra aviso nem carrega nada.
 * - Com ID: mostra o aviso até a pessoa escolher; o Pixel só carrega depois de "Aceitar".
 * - PageView na entrada e a cada troca de página; eventos (Lead etc.) saem de lib/medicao.ts.
 */
export function MedicaoMeta() {
  const id = medicao.metaPixelId.trim();
  const pathname = usePathname();
  const [escolha, setEscolha] = useState<Escolha | 'carregando'>('carregando');
  const primeiraPagina = useRef(true);

  useEffect(() => setEscolha(lerEscolha()), []);

  // Troca de página dentro do site (sem recarregar): novo PageView
  useEffect(() => {
    if (escolha !== 'aceitou') return;
    if (primeiraPagina.current) {
      primeiraPagina.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname, escolha]);

  if (!id) return null;

  const escolher = (v: 'aceitou' | 'recusou') => {
    try {
      window.localStorage.setItem(CHAVE, v);
    } catch {
      /* navegação privada: vale só nesta visita */
    }
    setEscolha(v);
  };

  return (
    <>
      {escolha === 'aceitou' && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
        </Script>
      )}

      {escolha === null && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/15 p-5 text-sobre-azul shadow-[0_1.5rem_4rem_-1rem_rgb(0_0_0/0.6)] sm:flex-row sm:items-center sm:gap-6 sm:pr-24"
          style={{ background: 'rgb(10 18 64 / 0.96)' }}
        >
          <p className="text-sm leading-relaxed text-sobre-azul-2">{comum.cookies.texto}</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => escolher('recusou')} className="botao botao-secundario !min-h-11 !px-4">
              {comum.cookies.recusar}
            </button>
            <button type="button" onClick={() => escolher('aceitou')} className="botao botao-principal !min-h-11 !px-4">
              {comum.cookies.aceitar}
            </button>
          </div>
        </div>
      )}

      {/* Sem JavaScript: imagem de rastreio só faz sentido com consentimento, então não há <noscript> */}
    </>
  );
}
