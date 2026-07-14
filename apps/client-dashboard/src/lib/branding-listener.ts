/**
 * Branding Override Listener
 * Listens for window.postMessage events from the Style Editor (Admin Dashboard).
 * Enables real-time preview of token overrides without reload.
 */
export function setupBrandingListener() {
  if (typeof window === 'undefined') return;

  // Only listen if we are inside an iframe (preview mode)
  if (window.parent === window) return;

  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from authorized origins (in production, validate this!)
    // For now, only accept BRANDING_OVERRIDE types
    if (event.data?.type !== 'BRANDING_OVERRIDE') return;

    const tokens = event.data.tokens || {};
    const root = document.documentElement;

    // Apply token overrides to CSS variables
    Object.entries(tokens).forEach(([key, value]) => {
      if (key.startsWith('--gf-')) {
        root.style.setProperty(key, value as string);
      }
    });

    console.log('[BRANDING_PREVIEW] Applied overrides:', tokens);
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}
