'use client';

/**
 * CSRF Hook for client components.
 * For fetch calls outside React components, use csrfFetch() from ./csrf instead.
 */

import { useEffect, useState } from 'react';

const CSRF_COOKIE = 'gf_csrf_token';
export const CSRF_HEADER = 'x-csrf-token';

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp('(^| )' + CSRF_COOKIE + '=([^;]+)')
    );
    if (match) {
      setCsrfToken(decodeURIComponent(match[2]));
    }
  }, []);

  const refreshCsrf = () => {
    const newMatch = document.cookie.match(
      new RegExp('(^| )' + CSRF_COOKIE + '=([^;]+)')
    );
    if (newMatch) {
      setCsrfToken(decodeURIComponent(newMatch[2]));
    }
  };

  return { csrfToken, refreshCsrf, CSRF_HEADER };
}
