'use client';

let hasRegistered = false;

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (hasRegistered || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    hasRegistered = true;
    return registration;
  } catch (error) {
    console.warn('Service worker registration failed', error);
    return null;
  }
}
