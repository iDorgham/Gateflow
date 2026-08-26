import * as LocalAuthentication from 'expo-local-authentication';
import {
  checkBiometricAvailability,
  authenticateGuardBiometrics,
} from './biometrics';

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  supportedAuthenticationTypesAsync: jest.fn(),
  authenticateAsync: jest.fn(),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

describe('checkBiometricAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns unavailable when device has no biometric hardware', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(
      false
    );

    const result = await checkBiometricAvailability();
    expect(result).toEqual({
      hasHardware: false,
      isEnrolled: false,
      biometricType: 'NONE',
      available: false,
    });
  });

  it('returns hardware available but not enrolled if enrolled is false', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);
    (
      LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock
    ).mockResolvedValue([
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    ]);

    const result = await checkBiometricAvailability();
    expect(result).toEqual({
      hasHardware: true,
      isEnrolled: false,
      biometricType: 'FACIAL_RECOGNITION',
      available: false,
    });
  });

  it('detects facial recognition when enrolled and supported', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (
      LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock
    ).mockResolvedValue([
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    ]);

    const result = await checkBiometricAvailability();
    expect(result).toEqual({
      hasHardware: true,
      isEnrolled: true,
      biometricType: 'FACIAL_RECOGNITION',
      available: true,
    });
  });

  it('detects fingerprint when enrolled and supported', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (
      LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock
    ).mockResolvedValue([LocalAuthentication.AuthenticationType.FINGERPRINT]);

    const result = await checkBiometricAvailability();
    expect(result).toEqual({
      hasHardware: true,
      isEnrolled: true,
      biometricType: 'FINGERPRINT',
      available: true,
    });
  });

  it('handles unexpected exceptions gracefully', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockRejectedValue(
      new Error('Hardware error')
    );

    const result = await checkBiometricAvailability();
    expect(result).toEqual({
      hasHardware: false,
      isEnrolled: false,
      biometricType: 'NONE',
      available: false,
    });
  });
});

describe('authenticateGuardBiometrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success: true when user authenticates successfully', async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
      success: true,
    });

    const result = await authenticateGuardBiometrics({
      promptMessage: 'Verify guard Face ID',
    });

    expect(result).toEqual({ success: true });
    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        promptMessage: 'Verify guard Face ID',
        disableDeviceFallback: true,
      })
    );
  });

  it('returns success: false with error when user cancels or fails auth', async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
      success: false,
      error: 'user_cancel',
      warning: 'User cancelled prompt',
    });

    const result = await authenticateGuardBiometrics();
    expect(result).toEqual({
      success: false,
      error: 'user_cancel',
      warning: 'User cancelled prompt',
    });
  });

  it('catches and maps native runtime rejections', async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockRejectedValue(
      new Error('Native auth bridge failure')
    );

    const result = await authenticateGuardBiometrics();
    expect(result).toEqual({
      success: false,
      error: 'Native auth bridge failure',
    });
  });
});
