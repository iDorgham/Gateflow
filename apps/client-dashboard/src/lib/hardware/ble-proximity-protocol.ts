import { createHmac, randomBytes } from 'crypto';

export interface BLEChallengePayload {
  challengeId: string;
  beaconUuid: string;
  nonce: string;
  timestamp: number;
}

export interface BLEResponsePayload {
  challengeId: string;
  residentId: string;
  signature: string;
}

export class BLEProximityProtocol {
  /**
   * Generates a BLE proximity challenge payload with 32-byte nonce.
   */
  static generateChallenge(beaconUuid: string): BLEChallengePayload {
    return {
      challengeId: `ble_${Date.now()}_${randomBytes(4).toString('hex')}`,
      beaconUuid,
      nonce: randomBytes(16).toString('hex'),
      timestamp: Date.now(),
    };
  }

  /**
   * Generates HMAC-SHA256 signature for BLE proximity response.
   */
  static generateResponseSignature(
    challenge: BLEChallengePayload,
    secretKey: string
  ): string {
    const dataToSign = `${challenge.challengeId}:${challenge.beaconUuid}:${challenge.nonce}:${challenge.timestamp}`;
    return createHmac('sha256', secretKey).update(dataToSign).digest('hex');
  }

  /**
   * Verifies BLE proximity challenge response and RSSI signal strength threshold (-75 dBm).
   */
  static verifyResponse(params: {
    challenge: BLEChallengePayload;
    signature: string;
    secretKey: string;
    rssiDbm: number;
    maxAgeMs?: number;
    minRssiDbm?: number;
  }): { valid: boolean; reason?: string } {
    const maxAgeMs = params.maxAgeMs ?? 15_000;
    const minRssiDbm = params.minRssiDbm ?? -75; // -75 dBm or stronger required

    // 1. Verify RSSI signal strength (distance cutoff)
    if (params.rssiDbm < minRssiDbm) {
      return {
        valid: false,
        reason: 'RSSI signal too weak — device out of proximity range',
      };
    }

    // 2. Verify timestamp freshness
    const now = Date.now();
    if (now - params.challenge.timestamp > maxAgeMs) {
      return { valid: false, reason: 'BLE challenge expired' };
    }

    // 3. Verify HMAC signature
    const expectedSig = this.generateResponseSignature(
      params.challenge,
      params.secretKey
    );
    if (expectedSig !== params.signature) {
      return { valid: false, reason: 'Invalid HMAC signature' };
    }

    return { valid: true };
  }
}
