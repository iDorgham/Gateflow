'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { WATCHLIST_ALERT_EVENT } from '@/lib/realtime/use-realtime-events';

interface WatchlistAlertPayload {
  contactName?: string;
  severity?: 'BLOCKED' | 'ESCORT';
  gateId?: string | null;
  qrCodeId?: string | null;
}

/**
 * SecurityNotifier — mounts once in DashboardLayout.
 * Listens for WATCHLIST_ALERT window events forwarded by useRealtimeEvents
 * and renders a high-priority toast notification.
 */
export function SecurityNotifier() {
  useEffect(() => {
    function handleAlert(e: Event) {
      const detail = (e as CustomEvent<WatchlistAlertPayload>).detail;
      const name = detail?.contactName ?? 'Unknown visitor';
      const severity = detail?.severity ?? 'BLOCKED';

      if (severity === 'BLOCKED') {
        toast.error(`Security Alert: ${name}`, {
          description:
            'Blocked visitor attempted gate access. Incident logged.',
          duration: 10_000,
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
        });
      } else {
        // ESCORT
        toast.warning(`Escort Required: ${name}`, {
          description: 'Visitor requires an escort. Please accompany them.',
          duration: 8_000,
          icon: <ShieldCheck className="h-5 w-5 text-amber-500" />,
        });
      }
    }

    window.addEventListener(WATCHLIST_ALERT_EVENT, handleAlert);
    return () => window.removeEventListener(WATCHLIST_ALERT_EVENT, handleAlert);
  }, []);

  // This component renders nothing — it only registers the side-effect listener.
  return null;
}
