import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { type ArrivalNotificationPayload, type ArrivalEvent } from '../types';
import {
  registerPushTokenWithBackend,
  executeGateAction,
} from '../services/pushService';
import {
  configureForegroundNotificationHandler,
  subscribeToNotificationResponses,
} from '../handlers/notificationHandlers';

export interface UseArrivalNotificationsResult {
  activeArrival: ArrivalEvent | null;
  pushToken: string | null;
  isProcessing: boolean;
  actionMessage: string | null;
  openGate: () => Promise<void>;
  rejectEntry: () => Promise<void>;
  callGuard: () => Promise<void>;
  dismissAlert: () => void;
}

export function useArrivalNotifications(): UseArrivalNotificationsResult {
  const [activeArrival, setActiveArrival] = useState<ArrivalEvent | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    configureForegroundNotificationHandler();
    registerPushTokenWithBackend().then((token) => {
      if (token) setPushToken(token);
    });

    // Listener for notifications received while app is foregrounded
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notif) => {
        const data = notif.request.content
          .data as unknown as ArrivalNotificationPayload;
        if (data?.visitorQRId && data?.visitorName) {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } catch {
            // Haptics fallback
          }

          setActiveArrival({
            id: `arr-${Date.now()}`,
            visitorName: data.visitorName,
            unitName: data.unitName ?? 'Your Unit',
            gateName: data.gateName ?? 'Main Gate',
            timestamp: Date.now(),
            visitorQRId: data.visitorQRId,
            status: 'PENDING',
          });
        }
      }
    );

    // Listener for notification responses (user tapped action button in OS banner)
    const responseSub = subscribeToNotificationResponses((action, res) => {
      setActionMessage(res.message);
      if (activeArrival) {
        setActiveArrival((prev) =>
          prev
            ? {
                ...prev,
                status: action === 'OPEN_GATE' ? 'OPENED' : 'REJECTED',
              }
            : null
        );
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  const openGate = useCallback(async () => {
    if (!activeArrival) return;
    setIsProcessing(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics fallback
    }

    const res = await executeGateAction('OPEN_GATE', activeArrival.visitorQRId);
    setIsProcessing(false);
    setActionMessage(res.message);
    setActiveArrival((prev) => (prev ? { ...prev, status: 'OPENED' } : null));

    setTimeout(() => {
      setActiveArrival(null);
      setActionMessage(null);
    }, 2500);
  }, [activeArrival]);

  const rejectEntry = useCallback(async () => {
    if (!activeArrival) return;
    setIsProcessing(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Haptics fallback
    }

    const res = await executeGateAction(
      'REJECT_ENTRY',
      activeArrival.visitorQRId
    );
    setIsProcessing(false);
    setActionMessage(res.message);
    setActiveArrival((prev) => (prev ? { ...prev, status: 'REJECTED' } : null));

    setTimeout(() => {
      setActiveArrival(null);
      setActionMessage(null);
    }, 2500);
  }, [activeArrival]);

  const callGuard = useCallback(async () => {
    if (!activeArrival) return;
    setIsProcessing(true);
    const res = await executeGateAction(
      'CALL_GUARD',
      activeArrival.visitorQRId
    );
    setIsProcessing(false);
    setActionMessage(res.message);
  }, [activeArrival]);

  const dismissAlert = useCallback(() => {
    setActiveArrival(null);
    setActionMessage(null);
  }, []);

  return {
    activeArrival,
    pushToken,
    isProcessing,
    actionMessage,
    openGate,
    rejectEntry,
    callGuard,
    dismissAlert,
  };
}
