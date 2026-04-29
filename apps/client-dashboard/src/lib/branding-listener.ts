'use client';

import * as React from 'react';
import { useEffect } from 'react';

/**
 * Branding PostMessage Listener
 * 
 * Injected into the Client Dashboard to listen for real-time 
 * theme overrides from the Admin Style Hub.
 */
export function useBrandingPreview() {
  useEffect(() => {
    // Only active in iframe
    if (typeof window === 'undefined' || window.parent === window) return;

    const handleMessage = (event: MessageEvent) => {
      // Security: Validate origin in production
      // For dev, we'll allow all while testing
      
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

/**
 * Global component that can be included in the root layout
 */
export function BrandingPreviewProvider({ children }: { children: React.ReactNode }) {
  useBrandingPreview();
  return <>{children}</>;
}
