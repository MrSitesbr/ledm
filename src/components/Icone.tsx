// Ícones oficiais da ledm-brand (line, traço 1.6px, grade 24×24), copiados do design system.
// O sprite entra uma vez no layout; cada ícone herda a cor do texto.

const simbolos: Record<string, string> = {
  chat: '<path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 3.5V16H6a2 2 0 01-2-2z"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20v-1a7 7 0 0114 0v1"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M3.5 20v-1a5.5 5.5 0 0111 0v1"/><path d="M16 5a3.4 3.4 0 010 6.6"/><path d="M18 14.2a5.5 5.5 0 013 4.8v1"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/>',
  chart: '<path d="M4 4v16h16"/><path d="M8 14l3-3 3 3 4-6"/>',
  document: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M9.5 13h5M9.5 16h5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M6 3l3 1 1 4-2 1a11 11 0 004 4l1-2 4 1 1 3a2 2 0 01-2 2A15 15 0 014 5a2 2 0 012-2z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  link: '<path d="M9.5 14.5l5-5"/><path d="M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  share: '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 11l7.8-4M8.1 13l7.8 4"/>',
  bell: '<path d="M6 10a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a1.5 1.5 0 013-0 1.5 1.5 0 013 0"/><path d="M9 11h6M9 15h4"/>',
};

export type NomeIcone = keyof typeof simbolos;

export function SpriteIcones() {
  const conteudo = Object.entries(simbolos)
    .map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${d}</symbol>`)
    .join('');
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: conteudo }}
    />
  );
}

export function Icone({ nome, className = 'size-6' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <use href={`#i-${nome}`} />
    </svg>
  );
}
