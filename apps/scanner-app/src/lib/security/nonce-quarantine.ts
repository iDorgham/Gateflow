/**
 * Nonce Quarantine & Anti-Replay Defense Engine
 * Prevents QR code replay attacks, cloned screenshot attacks, and packet retransmissions.
 */

export interface QuarantineRecord {
  nonce: string;
  gateId: string;
  deviceId: string;
  firstSeenAt: number;
  quarantinedAt: number;
  attemptsCount: number;
  reason: 'REPLAY_DETECTED' | 'OUT_OF_SEQUENCE' | 'EXPIRED_WINDOW';
}

export class NonceQuarantineManager {
  private seenNonces = new Map<string, number>(); // nonce -> timestamp
  private quarantine = new Map<string, QuarantineRecord>(); // nonce -> record
  private windowMs: number;

  constructor(windowMs: number = 10 * 60 * 1000) {
    this.windowMs = windowMs;
  }

  /**
   * Evaluates an incoming QR/barrier nonce for replay.
   * Returns { allowed: boolean, record?: QuarantineRecord, latencyMs: number }
   */
  public evaluateNonce(
    nonce: string,
    context: { gateId: string; deviceId: string; timestamp?: number }
  ): {
    allowed: boolean;
    quarantined: boolean;
    reason?: 'REPLAY_DETECTED' | 'EXPIRED_WINDOW';
    record?: QuarantineRecord;
    latencyMs: number;
  } {
    const startTime = performance.now();
    const now = Date.now();
    const nonceTime = context.timestamp ?? now;

    this.cleanup(now);

    // 1. Check if expired outside acceptable window (e.g. clock skew > windowMs)
    if (Math.abs(now - nonceTime) > this.windowMs) {
      const record: QuarantineRecord = {
        nonce,
        gateId: context.gateId,
        deviceId: context.deviceId,
        firstSeenAt: nonceTime,
        quarantinedAt: now,
        attemptsCount: 1,
        reason: 'EXPIRED_WINDOW',
      };
      this.quarantine.set(nonce, record);
      const latencyMs = performance.now() - startTime;
      return {
        allowed: false,
        quarantined: true,
        reason: 'EXPIRED_WINDOW',
        record,
        latencyMs,
      };
    }

    // 2. Check if already quarantined
    const existingQuarantine = this.quarantine.get(nonce);
    if (existingQuarantine) {
      existingQuarantine.attemptsCount += 1;
      const latencyMs = performance.now() - startTime;
      return {
        allowed: false,
        quarantined: true,
        reason: 'REPLAY_DETECTED',
        record: existingQuarantine,
        latencyMs,
      };
    }

    // 3. Check if previously seen
    if (this.seenNonces.has(nonce)) {
      const firstSeen = this.seenNonces.get(nonce)!;
      const record: QuarantineRecord = {
        nonce,
        gateId: context.gateId,
        deviceId: context.deviceId,
        firstSeenAt: firstSeen,
        quarantinedAt: now,
        attemptsCount: 2,
        reason: 'REPLAY_DETECTED',
      };
      this.quarantine.set(nonce, record);
      const latencyMs = performance.now() - startTime;
      return {
        allowed: false,
        quarantined: true,
        reason: 'REPLAY_DETECTED',
        record,
        latencyMs,
      };
    }

    // 4. Mark seen
    this.seenNonces.set(nonce, now);
    const latencyMs = performance.now() - startTime;
    return { allowed: true, quarantined: false, latencyMs };
  }

  /**
   * Retrieves all active quarantined records.
   */
  public getQuarantinedRecords(): QuarantineRecord[] {
    return Array.from(this.quarantine.values());
  }

  /**
   * Clears old nonces outside the replay window to bound memory.
   */
  private cleanup(now: number) {
    if (this.seenNonces.size < 1000) return;

    for (const [nonce, ts] of this.seenNonces.entries()) {
      if (now - ts > this.windowMs * 2) {
        this.seenNonces.delete(nonce);
      }
    }
  }

  /**
   * Reset state for testing.
   */
  public reset() {
    this.seenNonces.clear();
    this.quarantine.clear();
  }
}

export const globalNonceQuarantine = new NonceQuarantineManager();
