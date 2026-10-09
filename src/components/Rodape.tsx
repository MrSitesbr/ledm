import Link from 'next/link';
import comum from '@/content/comum.json';
import { empresa, opcoes, whatsappLink } from '@/lib/dados';
import { Logo } from './Logo';
import { Icone } from './Icone';

// Rodapé no azul mais escuro, no formato de painel arredondado do Aura (sem o nome gigante:
// o briefing proíbe escrever LEDM com fonte para simular a logo).
export function Rodape({ minimo = false }: { minimo?: boolean }) {
  const copyright = comum.rodape.copyright.replace('{cnpj}', empresa.cnpj);

  if (minimo) {
    return (
      <footer className="container-site py-8 text-sm text-tinta-3">
        <p>
          {copyright} <Link href="/privacidade" className="underline underline-offset-4">{comum.rodape.privacidade}</Link>
        </p>
      </footer>
    );
  }

  const linkClasse = 'inline-flex min-h-11 items-center text-sobre-azul-2 transition-colors hover:text-sobre-azul';

  return (
    <footer className="container-site pb-6">
      <div
        className="rounded-[var(--radius-painel)] text-sobre-azul"
        style={{ background: 'var(--color-azul-fundo)' }}
      >
        <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo fundo="escuro" altura={36} />
            <p className="mt-6 max-w-[34ch] font-[family-name:var(--font-titulo)] text-lg font-bold leading-snug">
              {comum.rodape.posicionamento}
            </p>
            <p className="mt-4 text-sobre-azul-3">{comum.rodape.local}</p>
          </div>

          <nav aria-label="Rodapé">
            <p className="rotulo text-sobre-azul-3">{comum.rodape.navegacao}</p>
            <ul className="mt-3">
              {comum.menu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClasse}>{item.rotulo}</Link>
                </li>
              ))}
              <li>
                <Link href="/privacidade" className={linkClasse}>{comum.rodape.privacidade}</Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="rotulo text-sobre-azul-3">{comum.rodape.contato}</p>
            <ul className="mt-3">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${linkClasse} gap-2`}>
                  <Icone nome="phone" className="size-5" /> WhatsApp {empresa.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={empresa.instagram} target="_blank" rel="noopener noreferrer" className={`${linkClasse} gap-2`}>
                  <Icone nome="instagram" className="size-5" /> Instagram {empresa.instagramUsuario}
                </a>
              </li>
              <li>
                <a href={empresa.linkedin} target="_blank" rel="noopener noreferrer" className={`${linkClasse} gap-2`}>
                  <Icone nome="link" className="size-5" /> LinkedIn
                </a>
              </li>
              {opcoes.youtube && (
                <li><a href={opcoes.youtube} target="_blank" rel="noopener noreferrer" className={linkClasse}>YouTube</a></li>
              )}
              {opcoes.facebook && (
                <li><a href={opcoes.facebook} target="_blank" rel="noopener noreferrer" className={linkClasse}>Facebook</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-linha-azul px-8 py-5 text-sm text-sobre-azul-3 sm:px-12">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
