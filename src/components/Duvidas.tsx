import duvidas from '@/content/duvidas.json';
import { preencher } from '@/lib/dados';

export const duvidasPreenchidas = duvidas.map((d) => ({ pergunta: d.pergunta, resposta: preencher(d.resposta) }));

/**
 * Lista sanfonada (details/summary: acessível por teclado e leitor de tela sem JavaScript).
 * Duas colunas no computador, como no Aura. A primeira pergunta abre aberta.
 */
export function Duvidas() {
  const metade = Math.ceil(duvidasPreenchidas.length / 2);
  const colunas = [duvidasPreenchidas.slice(0, metade), duvidasPreenchidas.slice(metade)];
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {colunas.map((col, c) => (
        <div key={c} className="grid gap-4">
          {col.map((d, i) => (
            <details
              key={d.pergunta}
              open={c === 0 && i === 0}
              className="group rounded-[var(--radius-cartao)] bg-branco"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-[family-name:var(--font-titulo)] text-[1.05rem] font-bold [&::-webkit-details-marker]:hidden">
                <span>{d.pergunta}</span>
                <span aria-hidden="true" className="relative size-5 shrink-0 rounded-full border border-current">
                  <span className="absolute top-1/2 left-1/2 h-px w-2.5 -translate-1/2 bg-current" />
                  <span className="absolute top-1/2 left-1/2 h-2.5 w-px -translate-1/2 bg-current transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <p className="px-6 pb-6 text-tinta-2">{d.resposta}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
