import { GuardBiometricLockService } from './guard-biometric-lock-service';

describe('GuardBiometricLockService', () => {
  beforeEach(() => {
    GuardBiometricLockService.clearState();
  });

  it('unlocks shift session via biometric challenge', () => {
    const session = GuardBiometricLockService.unlockSession({
      shiftId: 'shift_777',
      guardId: 'guard_12',
      biometricType: 'FACE_ID',
    });

    expect(session.isUnlocked).toBe(true);
    expect(session.biometricType).toBe('FACE_ID');

    const status = GuardBiometricLockService.isSessionUnlocked('shift_777');
    expect(status.unlocked).toBe(true);
  });

  it('locks session explicitly or when lock timer expires', () => {
    GuardBiometricLockService.unlockSession({
      shiftId: 'shift_888',
      guardId: 'guard_14',
      sessionDurationMs: -1000, // Expired
    });

    const status = GuardBiometricLockService.isSessionUnlocked('shift_888');
    expect(status.unlocked).toBe(false);
    expect(status.reason).toContain('Session lock timer expired');
  });
});
