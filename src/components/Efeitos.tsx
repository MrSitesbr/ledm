'use client';

import { useEffect } from 'react';

/**
 * Efeitos do template Aura, adaptados:
 * - [data-revelar]   blocos que entram do desfoque (opacity + blur + translateY)
 * - [data-palavras]  títulos que entram palavra por palavra
 * - [data-contar]    números que contam até o valor
 * - [data-pilha]     cartões de case empilhados: o de baixo encolhe, gira e desfoca
 * - [data-parallax]  imagem que se desloca devagar na rolagem
 * Faixas rolando e selo girando são só CSS (globals.css).
 */
export function Efeitos() {
  useEffect(() => {
    const observar = (sel: string, ao: (el: HTMLElement) => void, threshold = 0.12) => {
      const els = document.querySelectorAll<HTMLElement>(sel);
      const obs = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (e.isIntersecting) {
              ao(e.target as HTMLElement);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold },
      );
      els.forEach((el) => obs.observe(el));
      return obs;
    };

    const obsRevelar = observar('[data-revelar]', (el) => el.classList.add('revelado'));
    const obsPalavras = observar('[data-palavras]', (el) => el.classList.add('revelado'), 0.25);
    const obsAcende = observar('.acende', (el) => el.classList.add('aceso'), 0.6);
    const obsContar = observar(
      '[data-contar]',
      (el) => {
        const alvo = Number(el.dataset.contar);
        const inicio = performance.now();
        const dur = 1400;
        const passo = (t: number) => {
          const p = Math.min((t - inicio) / dur, 1);
          el.textContent = String(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      },
      0.5,
    );

    // Cartões empilhados e parallax: atualizados num único quadro por rolagem
    const pilhas = [...document.querySelectorAll<HTMLElement>('[data-pilha]')];
    const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    let pendente = false;
    const aoRolar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => {
        pendente = false;
        const vh = window.innerHeight;
        pilhas.forEach((card, i) => {
          if (i === pilhas.length - 1) return;
          const r = card.parentElement!.getBoundingClientRect();
          const p = Math.min(Math.max(-r.top / (r.height - vh * 0.8), 0), 1);
          const giro = p * (i % 2 ? 2.5 : -2.5);
          card.style.transform = `scale(${1 - p * 0.08}) rotate(${giro}deg)`;
          card.style.filter = `blur(${p * 4}px)`;
          card.style.opacity = String(1 - p * 0.35);
        });
        parallax.forEach((el) => {
          // data-parallax="fundo" (padrão): imagem ampliada que desliza dentro da moldura.
          // data-parallax="peca": elemento solto (mockup) que flutua na velocidade de data-velocidade.
          const peca = el.dataset.parallax === 'peca';
          const vel = Number(el.dataset.velocidade ?? (peca ? -0.1 : -0.12));
          const r = el.parentElement!.getBoundingClientRect();
          const desloca = (r.top + r.height / 2 - vh / 2) * vel;
          el.style.transform = `translate3d(0, ${desloca}px, 0)${peca ? '' : ` scale(${el.dataset.escala ?? 1.15})`}`;
        });
      });
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar, { passive: true });
    aoRolar();

    return () => {
      [obsRevelar, obsPalavras, obsAcende, obsContar].forEach((o) => o.disconnect());
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, []);

  return null;
}
