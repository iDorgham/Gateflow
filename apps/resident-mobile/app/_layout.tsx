import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { nativeTokensNewEra as nativeTokens } from '../../../packages/ui/src/tokens';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: nativeTokens.colors.background,
          },
          headerTintColor: nativeTokens.colors.textHeading,
          headerTitleStyle: {
            fontFamily: 'Cairo_700Bold',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: nativeTokens.colors.background,
          },
        }}
      >
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
            title: 'SIGN IN',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="visitors/[id]"
          options={{
            title: 'VISITOR PASS',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
