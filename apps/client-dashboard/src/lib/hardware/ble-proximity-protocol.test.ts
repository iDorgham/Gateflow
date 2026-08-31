import { BLEProximityProtocol } from './ble-proximity-protocol';

describe('BLEProximityProtocol', () => {
  const secretKey = 'ble_secret_key_palm_hills';
  const beaconUuid = 'e2c56db5-dffb-48d2-b060-d0f5a71096e0';

  it('generates challenge and validates matching HMAC response with strong RSSI', () => {
    const challenge = BLEProximityProtocol.generateChallenge(beaconUuid);
    const signature = BLEProximityProtocol.generateResponseSignature(
      challenge,
      secretKey
    );

    const verification = BLEProximityProtocol.verifyResponse({
      challenge,
      signature,
      secretKey,
      rssiDbm: -62, // Strong signal (-62 > -75 cutoff)
    });

    expect(verification.valid).toBe(true);
  });

  it('rejects BLE response if device is too far (RSSI weaker than -75 dBm)', () => {
    const challenge = BLEProximityProtocol.generateChallenge(beaconUuid);
    const signature = BLEProximityProtocol.generateResponseSignature(
      challenge,
      secretKey
    );

    const verification = BLEProximityProtocol.verifyResponse({
      challenge,
      signature,
      secretKey,
      rssiDbm: -88, // Out of range (-88 < -75 cutoff)
    });

    expect(verification.valid).toBe(false);
    expect(verification.reason).toContain('RSSI signal too weak');
  });

  it('rejects BLE response with invalid signature', () => {
    const challenge = BLEProximityProtocol.generateChallenge(beaconUuid);

    const verification = BLEProximityProtocol.verifyResponse({
      challenge,
      signature: 'invalid_forged_signature',
      secretKey,
      rssiDbm: -50,
    });

    expect(verification.valid).toBe(false);
    expect(verification.reason).toContain('Invalid HMAC signature');
  });
});
