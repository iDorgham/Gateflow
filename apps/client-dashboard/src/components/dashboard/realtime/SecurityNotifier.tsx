'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { WATCHLIST_ALERT_EVENT } from '@/lib/realtime/use-realtime-events';

interface WatchlistAlertPayload {
  // Watchlist-triggered alerts
  contactName?: string;
  severity?: 'BLOCKED' | 'ESCORT' | 'CRITICAL';
  gateId?: string | null;
  qrCodeId?: string | null;
  // Perimeter-incident alerts
  incidentId?: string | null;
  reason?: string | null;
}

/**
 * SecurityNotifier — mounts once in DashboardLayout.
 * Listens for WATCHLIST_ALERT window events forwarded by useRealtimeEvents
 * and renders a high-priority toast notification.
 *
 * Handles two alert shapes:
 *   - Watchlist: { contactName, severity: 'BLOCKED' | 'ESCORT' }
 *   - Perimeter incident: { incidentId, reason, severity: 'CRITICAL' }
 */
export function SecurityNotifier() {
  useEffect(() => {
    function handleAlert(e: Event) {
      const detail = (e as CustomEvent<WatchlistAlertPayload>).detail;
      const severity = detail?.severity ?? 'BLOCKED';

      if (severity === 'CRITICAL') {
        // Perimeter incident (tailgating / LPR / forced entry)
        const reason = detail?.reason ?? 'Perimeter anomaly detected.';
        toast.error('Perimeter Incident', {
          description: reason,
          duration: 12_000,
          icon: <ShieldAlert className="h-5 w-5 text-danger" />,
        });
      } else if (severity === 'BLOCKED') {
        const name = detail?.contactName ?? 'Unknown visitor';
        toast.error(`Security Alert: ${name}`, {
          description:
            'Blocked visitor attempted gate access. Incident logged.',
          duration: 10_000,
          icon: <ShieldAlert className="h-5 w-5 text-danger" />,
        });
      } else {
        // ESCORT
        const name = detail?.contactName ?? 'Unknown visitor';
        toast.warning(`Escort Required: ${name}`, {
          description: 'Visitor requires an escort. Please accompany them.',
          duration: 8_000,
          icon: <ShieldCheck className="h-5 w-5 text-warning" />,
        });
      }
    }

    window.addEventListener(WATCHLIST_ALERT_EVENT, handleAlert);
    return () => window.removeEventListener(WATCHLIST_ALERT_EVENT, handleAlert);
  }, []);

  // This component renders nothing — it only registers the side-effect listener.
  return null;
}
