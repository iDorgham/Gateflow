'use client';

/**
 * CSRF Hook for client components
 *
 * Provides CSRF token for form submissions
 */

import { useEffect, useState } from 'react';

const CSRF_COOKIE = 'gf_csrf_token';
const CSRF_HEADER = 'x-csrf-token';

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // Read CSRF token from cookie on mount
    const match = document.cookie.match(
      new RegExp('(^| )' + CSRF_COOKIE + '=([^;]+)')
    );
    if (match) {
      setCsrfToken(decodeURIComponent(match[2]));
    }
  }, []);

  // Refresh CSRF token from cookie
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

/**
 * Fetch wrapper that automatically adds CSRF token
 */
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { csrfToken, CSRF_HEADER } = useCsrf();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (csrfToken) {
    headers.set(CSRF_HEADER, csrfToken);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
