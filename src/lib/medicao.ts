// Eventos de medição. Só disparam se GA4 ou Pixel tiverem sido carregados,
// o que só acontece depois do aceite no aviso de cookies (componente MedicaoMeta).
type Evento = 'pedido_teste' | 'abriu_painel' | 'usou_calculadora' | 'abriu_whatsapp_flutuante';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Eventos que viram eventos padrão da Meta (usados para otimizar campanhas)
const padraoMeta: Partial<Record<Evento, string>> = {
  pedido_teste: 'Lead', // formulário enviado: abre o WhatsApp com os dados
  abriu_whatsapp_flutuante: 'Contact',
};

export function registrarEvento(nome: Evento, dados: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', nome, dados);
  const padrao = padraoMeta[nome];
  if (padrao) window.fbq?.('track', padrao, dados);
  window.fbq?.('trackCustom', nome, dados);
}
