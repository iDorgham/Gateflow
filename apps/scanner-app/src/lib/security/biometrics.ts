import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricAuthType =
  'FACIAL_RECOGNITION' | 'FINGERPRINT' | 'IRIS' | 'NONE';

export interface BiometricAvailability {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometricType: BiometricAuthType;
  available: boolean;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
}

export interface BiometricAuthOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

/**
 * Inspects device hardware capabilities and biometry enrollment state.
 */
export async function checkBiometricAvailability(): Promise<BiometricAvailability> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return {
        hasHardware: false,
        isEnrolled: false,
        biometricType: 'NONE',
        available: false,
      };
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricAuthType = 'NONE';
    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      biometricType = 'FACIAL_RECOGNITION';
    } else if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      biometricType = 'FINGERPRINT';
    } else if (
      supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      biometricType = 'IRIS';
    }

    return {
      hasHardware: true,
      isEnrolled,
      biometricType,
      available: hasHardware && isEnrolled,
    };
  } catch {
    return {
      hasHardware: false,
      isEnrolled: false,
      biometricType: 'NONE',
      available: false,
    };
  }
}

/**
 * Prompts the guard with a native biometric verification dialog.
 */
export async function authenticateGuardBiometrics(
  options: BiometricAuthOptions = {}
): Promise<BiometricAuthResult> {
  try {
    const {
      promptMessage = 'Verify guard identity with biometrics',
      cancelLabel = 'Cancel',
      fallbackLabel = 'Use PIN',
      disableDeviceFallback = true,
    } = options;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel,
      fallbackLabel,
      disableDeviceFallback,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error ?? 'Authentication failed',
      warning: result.warning,
    };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Unknown biometric error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
