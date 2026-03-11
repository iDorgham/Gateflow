import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'GateFlow Resident',
          }}
        />
        <Stack.Screen
          name="qrs"
          options={{
            title: 'My visitor QRs',
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign in',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

