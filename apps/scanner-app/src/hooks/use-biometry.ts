import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type BiometrySupport = 'FACE_ID' | 'FINGERPRINT' | 'IRIS' | 'NONE';

interface UseBiometryResult {
  isSupported: boolean;
  biometryType: BiometrySupport;
  isEnrolled: boolean;
  authenticate: (reason?: string) => Promise<boolean>;
  loading: boolean;
}

export function useBiometry(): UseBiometryResult {
  const [isSupported, setIsSupported] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometrySupport>('NONE');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSupport() {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible || !mounted) {
          setLoading(false);
          return;
        }

        setIsSupported(true);

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
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
        }
      } catch (error) {
        console.error('[useBiometry] Error checking biometry support:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSupport();

    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = useCallback(
    async (reason = 'Authenticate to access GateFlow scanner') => {
      if (!isSupported || !isEnrolled) return false;

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: reason,
          fallbackLabel: 'Use PIN',
          disableDeviceFallback: false,
        });

        return result.success;
      } catch (error) {
        console.error('[useBiometry] Authentication error:', error);
        return false;
      }
    },
    [isSupported, isEnrolled]
  );

  return { isSupported, biometryType, isEnrolled, authenticate, loading };
}
