import Image from 'next/image';
import Link from 'next/link';

// Arquivos originais da ledm-brand, só redimensionados para a web.
// "escuro" = logo para fundo escuro (texto branco); "claro" = para fundo claro (texto azul).
const arquivos = {
  escuro: '/brand/ledm-horizontal-escuro.webp',
  claro: '/brand/ledm-horizontal-claro.webp',
};

export function Logo({
  fundo = 'escuro',
  altura = 36,
  link = true,
}: {
  fundo?: 'escuro' | 'claro';
  altura?: number;
  link?: boolean;
}) {
  // Proporção do arquivo: 480 × 154
  const largura = Math.round((altura * 480) / 154);
  const img = (
    <Image
      src={arquivos[fundo]}
      alt="Led Marketing"
      width={largura}
      height={altura}
      priority
      style={{ height: altura, width: 'auto' }}
    />
  );
  if (!link) return img;
  return (
    <Link href="/" aria-label="Led Marketing, página inicial" className="inline-flex shrink-0">
      {img}
    </Link>
  );
}
