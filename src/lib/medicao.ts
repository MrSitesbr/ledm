// Eventos de medição. Só disparam se GA4 ou Pixel tiverem sido carregados,
// o que só acontece depois do aceite no aviso de cookies.
type Evento = 'pedido_teste' | 'abriu_painel' | 'usou_calculadora' | 'abriu_whatsapp_flutuante';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function registrarEvento(nome: Evento, dados: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', nome, dados);
  window.fbq?.('trackCustom', nome, dados);
}
