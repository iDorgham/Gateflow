import { useCallback, useEffect, useState } from 'react';
import { nativeTokensNewEra as nativeTokens } from '../../packages/ui/src/tokens';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getValidAccessToken, logout } from './src/lib/auth-client';
import { DeviceUnlockScreen } from './src/components/DeviceUnlockScreen';
import { OnboardingNavigator } from './src/navigators/onboarding-navigator';
import { BiometricGuard } from './src/components/security/biometric-guard';
import { hasCompletedOnboarding } from './src/lib/security/onboarding';
import { useShiftSession } from './src/hooks/use-shift-session';
import { LoginScreen } from './src/screens/login/login-screen';
import { ScannerScreen } from './src/screens/scanner/scanner-screen';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';

// ─── App-level state machine ──────────────────────────────────────────────────

/** Top-level phase of the application. */
type AppPhase =
  'initializing' | 'login' | 'onboarding' | 'unlock' | 'scanner' | 'locked';

async function nextPhaseAfterAuth(): Promise<'onboarding' | 'unlock'> {
  const onboarded = await hasCompletedOnboarding();
  return onboarded ? 'unlock' : 'onboarding';
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('initializing');
  const shift = useShiftSession({
    enabled: appPhase !== 'login' && appPhase !== 'initializing',
  });
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  // On mount: check SecureStore for a valid (or refreshable) token.
  // First-run devices enter onboarding; otherwise the unlock gate.
  useEffect(() => {
    let active = true;
    let completed = false;
    const fallbackTimer = setTimeout(() => {
      if (active && !completed) {
        completed = true;
        setAppPhase('login');
      }
    }, 2000);

    getValidAccessToken()
      .then(async (token) => {
        if (!active || completed) return;
        clearTimeout(fallbackTimer);
        completed = true;
        if (!token) {
          setAppPhase('login');
          return;
        }
        setAppPhase(await nextPhaseAfterAuth());
      })
      .catch(() => {
        if (!active || completed) return;
        clearTimeout(fallbackTimer);
        completed = true;
        setAppPhase('login');
      });

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInactivityLock = useCallback(() => setAppPhase('locked'), []);

  // Allow app to proceed even if Google Font network fetch is delayed
  if (!fontsLoaded && appPhase === 'initializing') {
    // Show initializing splash screen while loading
  }

  const handleLoginSuccess = async () => {
    setAppPhase(await nextPhaseAfterAuth());
  };

  const handleOnboardingComplete = () => setAppPhase('unlock');

  const handleUnlocked = () => setAppPhase('scanner');

  const handleLogout = async () => {
    const mayProceed = await shift.disposeForLogout();
    if (!mayProceed) return;
    await logout();
    setAppPhase('login');
  };

  if (appPhase === 'initializing') {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: nativeTokens.colors.background },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={nativeTokens.colors.background}
        />
        <View style={styles.splashLogo}>
          <View
            style={[
              styles.splashInner,
              { borderColor: nativeTokens.colors.primary },
            ]}
          />
        </View>
        <ActivityIndicator
          size="large"
          color={nativeTokens.colors.primary}
          style={{ marginTop: 32 }}
        />
        <Text style={styles.initBrand}>GateFlow</Text>
        <Text style={styles.initSub}>SCANNER</Text>
      </View>
    );
  }

  if (appPhase === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  if (appPhase === 'onboarding') {
    return (
      <OnboardingNavigator
        onComplete={handleOnboardingComplete}
        onLogout={handleLogout}
      />
    );
  }

  if (appPhase === 'unlock' || appPhase === 'locked') {
    return (
      <DeviceUnlockScreen onUnlocked={handleUnlocked} onLogout={handleLogout} />
    );
  }

  return (
    <BiometricGuard enabled onLock={handleInactivityLock}>
      <ScannerScreen onLogout={handleLogout} shift={shift} />
    </BiometricGuard>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nativeTokens.colors.background,
  },
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    ...nativeTokens.shadows.satinRaised,
  },
  splashInner: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: nativeTokens.colors.primary,
  },
  initBrand: {
    marginTop: 24,
    fontSize: 32,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
  },
  initSub: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    letterSpacing: 4,
    marginTop: 4,
  },
});
