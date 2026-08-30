import * as Notifications from 'expo-notifications';
import {
  ACTION_OPEN_GATE,
  ACTION_REJECT_ENTRY,
  ACTION_CALL_GUARD,
  executeGateAction,
} from '../services/pushService';
import { type ArrivalNotificationPayload } from '../types';

export function configureForegroundNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function subscribeToNotificationResponses(
  onActionComplete?: (
    action: string,
    result: { success: boolean; message: string }
  ) => void
) {
  return Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content
        .data as unknown as ArrivalNotificationPayload;

      if (!data?.visitorQRId) return;

      if (actionId === ACTION_OPEN_GATE) {
        const res = await executeGateAction('OPEN_GATE', data.visitorQRId);
        onActionComplete?.('OPEN_GATE', res);
      } else if (actionId === ACTION_REJECT_ENTRY) {
        const res = await executeGateAction('REJECT_ENTRY', data.visitorQRId);
        onActionComplete?.('REJECT_ENTRY', res);
      } else if (actionId === ACTION_CALL_GUARD) {
        const res = await executeGateAction(
          'CALL_GUARD',
          data.visitorQRId,
          data.guardPhone
        );
        onActionComplete?.('CALL_GUARD', res);
      }
    }
  );
}
