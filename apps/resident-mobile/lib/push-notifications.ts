import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { residentFetch } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });

    await Notifications.setNotificationChannelAsync('visitor-scans', {
      name: 'Visitor Scans',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  const { data: pushToken } = await Notifications.getExpoPushTokenAsync();

  if (pushToken) {
    await sendPushTokenToServer(pushToken);
  }

  return pushToken;
}

async function sendPushTokenToServer(pushToken: string) {
  try {
    const deviceType = await Device.getDeviceTypeAsync();
    const deviceId = `${deviceType}-${Platform.OS}`;
    await residentFetch('/resident/push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushToken, deviceId }),
    });
    console.log('Push token registered successfully');
  } catch (error) {
    console.error('Failed to register push token:', error);
  }
}

export async function removePushToken() {
  try {
    await residentFetch('/resident/push-token', {
      method: 'DELETE',
    });
    console.log('Push token removed successfully');
  } catch (error) {
    console.error('Failed to remove push token:', error);
  }
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export interface NotificationData {
  type?: string;
  visitorQRId?: string;
  visitorName?: string;
  gateId?: string;
  gateName?: string;
}
