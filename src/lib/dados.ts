// Única porta de entrada para números e opções do site.
// Todo valor exibido sai de src/data/site.json através daqui.
import site from '../data/site.json';

export type Plano = (typeof site.planos)[number];

export const empresa = site.empresa;
export const opcoes = site.opcoes;
/** IDs de medição (Meta Pixel). Vazio = nada é carregado. */
export const medicao = site.medicao;
export const premissas = site.premissas;
export const calculadora = site.calculadora;
export const planos: Plano[] = site.planos;
export const upgrades = site.upgrades;

export function plano(id: string): Plano {
  const p = planos.find((x) => x.id === id);
  if (!p) throw new Error(`Plano desconhecido: ${id}`);
  return p;
}

/** R$1.900 · R$16.648 · -R$568 (sem espaço, separador de milhar) */
export function brl(valor: number): string {
  const n = Math.abs(Math.round(valor)).toLocaleString('pt-BR');
  return `${valor < 0 ? '-' : ''}R$${n}`;
}

/** Só o número formatado, sem "R$" (para o número principal com "R$" menor) */
export function milhar(valor: number): string {
  return Math.abs(Math.round(valor)).toLocaleString('pt-BR');
}

/**
 * Troca marcadores do texto pelos valores do arquivo de dados.
 * {{custo}} / {{implantacao}} / {{realista}} / {{minimo}} usam o plano do contexto.
 * {{plano-id.campo}} usa um plano específico (ex.: {{plantao-digital.custoMensal}}).
 * {{premissa.campo}} usa as premissas (ex.: {{premissa.valorUnidade}}).
 */
export function preencher(texto: string, contexto?: Plano): string {
  return texto.replace(/\{\{([\w.-]+)\}\}/g, (_, chave: string) => {
    const curtos: Record<string, keyof Plano> = {
      custo: 'custoMensal',
      implantacao: 'implantacao',
      realista: 'totalRealista',
      minimo: 'totalMinimo',
    };
    if (curtos[chave]) {
      if (!contexto) throw new Error(`Marcador {{${chave}}} sem plano de contexto`);
      return brl(contexto[curtos[chave]] as number);
    }
    const [alvo, campo] = chave.split('.');
    if (alvo === 'premissa') {
      const v = (premissas as unknown as Record<string, number>)[campo];
      if (v === undefined) throw new Error(`Premissa desconhecida: ${campo}`);
      return campo.endsWith('Percentual') ? `${v}%` : campo.startsWith('contatos') ? String(v) : brl(v);
    }
    const v = (plano(alvo) as unknown as Record<string, unknown>)[campo];
    if (typeof v !== 'number') throw new Error(`Campo inválido: ${chave}`);
    return brl(v);
  });
}

export function whatsappLink(mensagem?: string): string {
  const base = `https://wa.me/${empresa.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
