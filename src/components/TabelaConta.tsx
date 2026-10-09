import { brl, type Plano } from '@/lib/dados';

/** Tabela "De onde vem": no máximo 5 linhas, sem grade vertical, total em destaque. */
export function TabelaConta({ plano, sobre = 'azul' }: { plano: Plano; sobre?: 'azul' | 'claro' }) {
  const linha = sobre === 'azul' ? 'border-linha-azul' : 'border-linha-clara';
  const sec = sobre === 'azul' ? 'text-sobre-azul-2' : 'text-tinta-2';
  return (
    <div className="overflow-x-auto">
      <table className="numeros w-full border-collapse text-left text-[0.875rem] font-medium sm:text-base">
        <caption className="sr-only">De onde vem o valor que o {plano.nome} devolve por mês</caption>
        <thead>
          <tr className={`border-b ${linha} ${sec}`}>
            <th scope="col" className="rotulo py-3 pr-3 font-bold !tracking-[0.08em] sm:pr-4 sm:!tracking-[0.18em]">De onde vem</th>
            <th scope="col" className="rotulo py-3 pr-3 text-right font-bold !tracking-[0.08em] sm:pr-4 sm:!tracking-[0.18em]">No mínimo</th>
            <th scope="col" className="rotulo py-3 text-right font-bold !tracking-[0.08em] sm:!tracking-[0.18em]">Cenário realista</th>
          </tr>
        </thead>
        <tbody>
          {plano.conta.map((r) => (
            <tr key={r.origem} className={`border-b ${linha}`}>
              <th scope="row" className="py-3.5 pr-3 font-medium sm:pr-4">{r.origem}</th>
              <td className="py-3.5 pr-3 text-right whitespace-nowrap sm:pr-4">{brl(r.minimo)}</td>
              <td className="py-3.5 text-right whitespace-nowrap">{brl(r.realista)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-[family-name:var(--font-titulo)] text-base font-extrabold sm:text-lg">
            <th scope="row" className="pt-4 pr-3 sm:pr-4">Total devolvido por mês</th>
            <td className="pt-4 pr-3 text-right whitespace-nowrap sm:pr-4">{brl(plano.totalMinimo)}</td>
            <td className="pt-4 text-right whitespace-nowrap">{brl(plano.totalRealista)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
