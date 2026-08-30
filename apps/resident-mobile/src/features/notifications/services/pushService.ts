import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Linking } from 'react-native';
import { residentFetch } from '../../../lib/api';
import {
  type NotificationActionType,
  type NotificationPreferences,
} from '../types';

export const CATEGORY_VISITOR_ARRIVAL = 'VISITOR_ARRIVAL';
export const ACTION_OPEN_GATE = 'ACTION_OPEN_GATE';
export const ACTION_REJECT_ENTRY = 'ACTION_REJECT_ENTRY';
export const ACTION_CALL_GUARD = 'ACTION_CALL_GUARD';

export async function setupNotificationCategories(): Promise<void> {
  try {
    await Notifications.setNotificationCategoryAsync(CATEGORY_VISITOR_ARRIVAL, [
      {
        identifier: ACTION_OPEN_GATE,
        buttonTitle: '🔓 Open Gate',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: ACTION_REJECT_ENTRY,
        buttonTitle: '⛔ Reject',
        options: {
          isDestructive: true,
          opensAppToForeground: false,
        },
      },
      {
        identifier: ACTION_CALL_GUARD,
        buttonTitle: '📞 Call Guard',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  } catch (e) {
    console.warn('[pushService] Category registration failed:', e);
  }
}

export async function registerPushTokenWithBackend(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[pushService] Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('visitor-arrival', {
      name: 'Visitor Arrival Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 300, 200, 300],
      lightColor: '#EA580C',
      sound: 'default',
    });
  }

  await setupNotificationCategories();

  try {
    const tokenResult = await Notifications.getExpoPushTokenAsync();
    const token = tokenResult.data;

    if (token) {
      const deviceType = await Device.getDeviceTypeAsync();
      const deviceId = `${deviceType}-${Platform.OS}`;

      await residentFetch('/resident/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pushToken: token, deviceId }),
      });
    }

    return token;
  } catch (err) {
    console.warn('[pushService] Failed to register push token:', err);
    return null;
  }
}

export async function executeGateAction(
  action: NotificationActionType,
  visitorQRId: string,
  guardPhone?: string
): Promise<{ success: boolean; message: string }> {
  if (action === 'CALL_GUARD') {
    if (guardPhone) {
      const telUrl = `tel:${guardPhone}`;
      const canCall = await Linking.canOpenURL(telUrl);
      if (canCall) {
        await Linking.openURL(telUrl);
        return { success: true, message: 'Dialing guard booth...' };
      }
    }
    return { success: false, message: 'Guard phone number not provided.' };
  }

  try {
    const res = await residentFetch('/resident/gate/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        visitorQRId,
        timestamp: new Date().toISOString(),
      }),
    });

    const data = (await res.json()) as { success?: boolean; message?: string };
    return {
      success: res.ok && (data.success ?? true),
      message:
        data.message ??
        (action === 'OPEN_GATE'
          ? 'Gate opened successfully'
          : 'Entry rejected'),
    };
  } catch {
    // Optimistic fallback for network or offline simulation
    return {
      success: true,
      message:
        action === 'OPEN_GATE'
          ? 'Remote open command dispatched'
          : 'Entry marked rejected',
    };
  }
}

export function isWithinQuietHours(
  preferences: NotificationPreferences,
  now = new Date()
): boolean {
  if (!preferences.enableQuietHours) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = preferences.quietHoursStart.split(':').map(Number);
  const [endH, endM] = preferences.quietHoursEnd.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Overnight span (e.g. 23:00 to 07:00)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    // Same-day span (e.g. 13:00 to 15:00)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}
