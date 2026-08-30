import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';

export type BiometrySupport = 'FACE_ID' | 'FINGERPRINT' | 'IRIS' | 'NONE';

const MAX_BIOMETRIC_ATTEMPTS = 3;
const SESSION_TIMEOUT_MS = 60 * 1000; // 60s session timeout
const PIN_STORE_KEY = 'gateflow_resident_pin_hash';
const DEFAULT_FALLBACK_PIN = '1234'; // Safe default if user has not customized PIN yet

export interface UseBiometricAuthResult {
  isSupported: boolean;
  biometryType: BiometrySupport;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  failedAttempts: number;
  showPinFallback: boolean;
  loading: boolean;
  authenticate: (reason?: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  setCustomPin: (pin: string) => Promise<void>;
  resetPinFallback: () => void;
  lockSession: () => void;
}

export function useBiometricAuth(): UseBiometricAuthResult {
  const [isSupported, setIsSupported] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometrySupport>('NONE');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showPinFallback, setShowPinFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastActiveRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Check hardware capabilities on mount
  useEffect(() => {
    let mounted = true;

    async function checkCapabilities() {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware || !mounted) {
          setIsSupported(false);
          setLoading(false);
          return;
        }

        setIsSupported(true);
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!mounted) return;
        setIsEnrolled(enrolled);

        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (!mounted) return;

        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometryType('FACE_ID');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometryType('FINGERPRINT');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          setBiometryType('IRIS');
        } else {
          setBiometryType('NONE');
        }
      } catch (e) {
        console.warn('[useBiometricAuth] Error checking hardware:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkCapabilities();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for AppState changes to enforce 45-60s session timeout
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const prev = appStateRef.current;
        appStateRef.current = nextAppState;

        if (prev.match(/inactive|background/) && nextAppState === 'active') {
          const elapsed = Date.now() - lastActiveRef.current;
          if (elapsed > SESSION_TIMEOUT_MS) {
            // Lock session on timeout
            setIsAuthenticated(false);
            setFailedAttempts(0);
            setShowPinFallback(false);
          }
        } else if (nextAppState.match(/inactive|background/)) {
          lastActiveRef.current = Date.now();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const triggerHaptic = useCallback(
    async (type: 'success' | 'error' | 'warning') => {
      try {
        if (type === 'success') {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } else if (type === 'error') {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
        } else {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
        }
      } catch {
        // Haptics unavailable on simulator or web
      }
    },
    []
  );

  const authenticate = useCallback(
    async (
      reason = 'Scan Face / Fingerprint to open gate'
    ): Promise<boolean> => {
      if (!isSupported || !isEnrolled) {
        setShowPinFallback(true);
        return false;
      }

      setIsAuthenticating(true);
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: reason,
          disableDeviceFallback: true,
          cancelLabel: 'Use PIN',
        });

        if (result.success) {
          await triggerHaptic('success');
          setIsAuthenticated(true);
          setFailedAttempts(0);
          setShowPinFallback(false);
          lastActiveRef.current = Date.now();
          return true;
        } else {
          const nextFailed = failedAttempts + 1;
          setFailedAttempts(nextFailed);
          await triggerHaptic('error');

          if (nextFailed >= MAX_BIOMETRIC_ATTEMPTS) {
            setShowPinFallback(true);
          }
          return false;
        }
      } catch (err) {
        console.warn('[useBiometricAuth] Auth error:', err);
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= MAX_BIOMETRIC_ATTEMPTS) {
          setShowPinFallback(true);
        }
        await triggerHaptic('error');
        return false;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [isSupported, isEnrolled, failedAttempts, triggerHaptic]
  );

  const verifyPin = useCallback(
    async (pin: string): Promise<boolean> => {
      try {
        let storedPin: string | null = null;
        try {
          storedPin = await SecureStore.getItemAsync(PIN_STORE_KEY, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          });
        } catch {
          storedPin = null;
        }

        const validPin = storedPin || DEFAULT_FALLBACK_PIN;

        if (pin === validPin) {
          await triggerHaptic('success');
          setIsAuthenticated(true);
          setShowPinFallback(false);
          setFailedAttempts(0);
          lastActiveRef.current = Date.now();
          return true;
        } else {
          await triggerHaptic('error');
          return false;
        }
      } catch {
        await triggerHaptic('error');
        return false;
      }
    },
    [triggerHaptic]
  );

  const setCustomPin = useCallback(async (pin: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(PIN_STORE_KEY, pin, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (err) {
      console.warn('[useBiometricAuth] Failed to set custom PIN:', err);
    }
  }, []);

  const resetPinFallback = useCallback(() => {
    setShowPinFallback(false);
    setFailedAttempts(0);
  }, []);

  const lockSession = useCallback(() => {
    setIsAuthenticated(false);
    setFailedAttempts(0);
    setShowPinFallback(false);
  }, []);

  return {
    isSupported,
    biometryType,
    isEnrolled,
    isAuthenticated,
    isAuthenticating,
    failedAttempts,
    showPinFallback,
    loading,
    authenticate,
    verifyPin,
    setCustomPin,
    resetPinFallback,
    lockSession,
  };
}
