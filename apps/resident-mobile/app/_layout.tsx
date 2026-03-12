import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getValidAccessToken } from '../lib/auth-client';
import { registerForPushNotificationsAsync } from '../lib/push-notifications';

function PushNotificationInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    async function initPush() {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setReady(true);
          return;
        }

        await registerForPushNotificationsAsync();
      } catch (error) {
        console.log('Push notifications not available:', error);
      } finally {
        setReady(true);
      }
    }

    initPush();

    // Deep link: tapping a notification opens the History tab
    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener(() => {
        router.push('/(tabs)/history');
      });

    return () => {
      responseListenerRef.current?.remove();
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PushNotificationInitializer>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign in',
          }}
        />
        <Stack.Screen
          name="visitors/[id]"
          options={{
            title: 'Visitor pass',
          }}
        />
        <Stack.Screen
          name="qrs/new"
          options={{
            title: 'New visitor pass',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="contact-picker"
          options={{
            title: 'Select contact',
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </PushNotificationInitializer>
  );
}
