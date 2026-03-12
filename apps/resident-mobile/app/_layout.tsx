import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getValidAccessToken } from '../lib/auth-client';

function PushNotificationInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initPush() {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setReady(true);
          return;
        }

        const { registerForPushNotificationsAsync } =
          await import('./lib/push-notifications');
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.log('Push notifications not available:', error);
      } finally {
        setReady(true);
      }
    }

    initPush();
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
      </Stack>
      <StatusBar style="dark" />
    </PushNotificationInitializer>
  );
}
