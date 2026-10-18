'use client';

import { useEffect, useRef, useState } from 'react';
import comum from '@/content/comum.json';
import { registrarEvento } from '@/lib/medicao';
import { FormularioTeste } from './FormularioTeste';
import { Icone } from './Icone';

const t = comum.whatsappFlutuante;

/**
 * Botão flutuante do WhatsApp (canto inferior direito). Não abre o WhatsApp direto:
 * abre um popup com o formulário das chamadas para ação, e o WhatsApp só abre
 * depois que a pessoa preenche os dados (mensagem montada pelo FormularioTeste).
 */
export function WhatsAppFlutuante() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const [aberto, setAberto] = useState(false);

  const abrir = () => {
    dialogo.current?.showModal();
    setAberto(true);
    registrarEvento('abriu_whatsapp_flutuante');
  };
  const fechar = () => dialogo.current?.close();

  // Esc e o botão Fechar disparam "close"; devolve o foco ao botão flutuante
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const aoFechar = () => {
      setAberto(false);
      botao.current?.focus();
    };
    d.addEventListener('close', aoFechar);
    return () => d.removeEventListener('close', aoFechar);
  }, []);

  return (
    <>
      <button
        ref={botao}
        type="button"
        onClick={abrir}
        aria-label={t.botao}
        title={t.botao}
        aria-haspopup="dialog"
        className={`fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full text-white shadow-[0_10px_30px_rgb(0_0_0/0.3)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amarelo sm:right-6 sm:bottom-6 sm:size-16 ${
          aberto ? 'pointer-events-none scale-75 opacity-0' : ''
        }`}
        style={{ background: '#25D366' }}
      >
        {/* Símbolo do WhatsApp */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 sm:size-8" fill="currentColor">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
        </svg>
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="titulo-whatsapp-flutuante"
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar(); // clique no fundo escurecido fecha
        }}
        className="m-auto w-[min(560px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[28px] border border-white/15 p-0 text-sobre-azul shadow-[0_2rem_6rem_-1rem_rgb(0_0_0/0.7)] backdrop:bg-[rgb(7_11_38/0.7)] backdrop:backdrop-blur-sm"
        style={{ background: 'linear-gradient(160deg, #0A1240 0%, #070B26 100%)' }}
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={fechar}
            aria-label={t.fechar}
            className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-linha-azul text-sobre-azul-2 transition-colors hover:text-sobre-azul"
          >
            <Icone nome="close" className="size-5" />
          </button>
          <span className="inline-flex size-11 items-center justify-center rounded-xl text-white" style={{ background: '#25D366' }} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
              <path d="M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
            </svg>
          </span>
          <h2 id="titulo-whatsapp-flutuante" className="mt-5 pr-12 font-[family-name:var(--font-titulo)] text-[1.6rem] leading-tight font-black tracking-[-0.02em]">
            {t.titulo}
          </h2>
          <p className="mt-2 mb-6 text-sobre-azul-2">{t.texto}</p>
          {/* Só monta o formulário com o popup aberto: começa sempre limpo */}
          {aberto && <FormularioTeste textoBotao={t.enviar} />}
        </div>
      </dialog>
    </>
  );
}
