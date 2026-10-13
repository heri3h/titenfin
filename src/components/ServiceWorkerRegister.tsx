'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('TitenFin SW registered successfully:', reg.scope);
          })
          .catch((err) => {
            console.warn('TitenFin SW registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
