import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { SpriteIcones } from '@/components/Icone';
import comum from '@/content/comum.json';
import { empresa } from '@/lib/dados';
import './globals.css';

// next/font baixa as fontes no build e serve do próprio site (sem chamada ao Google em produção).
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
  variable: '--fonte-montserrat',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--fonte-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(empresa.dominio),
  title: 'Led Marketing',
  icons: {
    icon: [{ url: '/brand/ledm-simbolo-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/brand/ledm-simbolo-180.png', sizes: '180x180' }],
  },
  openGraph: { locale: 'pt_BR', siteName: 'Led Marketing', type: 'website' },
};

export const viewport: Viewport = {
  themeColor: '#111D66',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <a href="#conteudo" className="pular">{comum.pularConteudo}</a>
        <SpriteIcones />
        {children}
      </body>
    </html>
  );
}
