'use client';

import { useEffect, ReactNode } from 'react';

export function useBrandingPreview() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BRANDING_OVERRIDE') {
        const { tokens } = event.data;
        const root = document.documentElement;

        Object.entries(tokens).forEach(([token, value]) => {
          root.style.setProperty(token as string, value as string);
        });

        console.log('[BRANDING_PREVIEW] Applied tokens:', tokens);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
}

export function BrandingPreviewProvider({ children }: { children: ReactNode }) {
  useBrandingPreview();
  return <>{children}</>;
}
