'use client';

import { useEffect } from 'react';
import { OfflineBanner } from '@/components/common/offline-banner';
import { registerServiceWorker } from '@/lib/sw-register';
import { registerPushSubscription, subscribeForPush } from '@/lib/push-notifications';
import { flushQueuedVisitorRequests } from '@/lib/pending-sync';

export function PwaBootstrap() {
  useEffect(() => {
    const setup = async () => {
      const registration = await registerServiceWorker();
      if (!registration) return;

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) return;

      try {
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          await registerPushSubscription(existing);
          return;
        }
        const subscription = await subscribeForPush(registration, vapidPublicKey);
        if (subscription) {
          await registerPushSubscription(subscription);
        }
      } catch (error) {
        console.warn('Push setup skipped', error);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    const onOnline = () => {
      flushQueuedVisitorRequests().catch((error) => {
        console.warn('Failed to flush queued visitor requests', error);
      });
    };
    window.addEventListener('online', onOnline);
    onOnline();
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return <OfflineBanner />;
}
