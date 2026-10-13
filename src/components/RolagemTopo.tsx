'use client';

import { useEffect } from 'react';

/** Ao abrir ou recarregar a página sem âncora (#), começa sempre no topo. */
export function RolagemTopo() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  return null;
}
