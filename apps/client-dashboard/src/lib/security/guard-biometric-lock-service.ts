export interface GuardBiometricSession {
  shiftId: string;
  guardId: string;
  isUnlocked: boolean;
  unlockedAt: string;
  expiresAt: string;
  biometricType: 'FACE_ID' | 'TOUCH_ID' | 'PASSCODE';
}

export class GuardBiometricLockService {
  private static activeSessions: Map<string, GuardBiometricSession> = new Map();

  /**
   * Unlocks guard shift session via verified biometric challenge.
   * Lock timer defaults to 15 minutes (900,000 ms).
   */
  static unlockSession(params: {
    shiftId: string;
    guardId: string;
    biometricType?: 'FACE_ID' | 'TOUCH_ID' | 'PASSCODE';
    sessionDurationMs?: number;
  }): GuardBiometricSession {
    const sessionDurationMs = params.sessionDurationMs ?? 15 * 60 * 1000;
    const now = Date.now();

    const session: GuardBiometricSession = {
      shiftId: params.shiftId,
      guardId: params.guardId,
      isUnlocked: true,
      unlockedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + sessionDurationMs).toISOString(),
      biometricType: params.biometricType || 'FACE_ID',
    };

    this.activeSessions.set(params.shiftId, session);
    return session;
  }

  /**
   * Verifies if guard shift session is currently unlocked and valid.
   */
  static isSessionUnlocked(shiftId: string): {
    unlocked: boolean;
    reason?: string;
  } {
    const session = this.activeSessions.get(shiftId);
    if (!session) {
      return { unlocked: false, reason: 'No active biometric session' };
    }

    const now = Date.now();
    const expiry = new Date(session.expiresAt).getTime();

    if (now > expiry) {
      session.isUnlocked = false;
      return { unlocked: false, reason: 'Session lock timer expired' };
    }

    return { unlocked: session.isUnlocked };
  }

  /**
   * Explicitly locks guard shift session (e.g. guard locks tablet or steps away).
   */
  static lockSession(shiftId: string): void {
    const session = this.activeSessions.get(shiftId);
    if (session) {
      session.isUnlocked = false;
    }
  }

  /**
   * Clears state for tests.
   */
  static clearState(): void {
    this.activeSessions.clear();
  }
}
