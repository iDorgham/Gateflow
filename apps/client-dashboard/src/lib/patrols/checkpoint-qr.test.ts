import {
  generateCheckpointPayload,
  encodeCheckpointQrString,
  decodeCheckpointQrString,
  verifyCheckpointPayload,
  generateCheckpointPlacardSvg,
  PATROL_QR_PREFIX,
} from './checkpoint-qr';

describe('Checkpoint QR & HMAC Crypto Engine', () => {
  const orgId = 'org_test_123';
  const routeId = 'route_north_loop';
  const checkpointId = 'cp_gate_4_fence';

  it('generates a valid checkpoint payload with HMAC signature and nonce', () => {
    const payload = generateCheckpointPayload({ orgId, routeId, checkpointId });

    expect(payload.orgId).toBe(orgId);
    expect(payload.routeId).toBe(routeId);
    expect(payload.checkpointId).toBe(checkpointId);
    expect(payload.nonce).toBeDefined();
    expect(payload.nonce.length).toBe(16); // 8 bytes in hex
    expect(payload.timestamp).toBeGreaterThan(0);
    expect(payload.hmac).toBeDefined();
    expect(payload.hmac.length).toBe(64); // SHA-256 in hex
  });

  it('encodes and decodes QR string reliably', () => {
    const payload = generateCheckpointPayload({ orgId, routeId, checkpointId });
    const qrString = encodeCheckpointQrString(payload);

    expect(qrString.startsWith(`${PATROL_QR_PREFIX}:`)).toBe(true);

    const decoded = decodeCheckpointQrString(qrString);
    expect(decoded).not.toBeNull();
    expect(decoded?.orgId).toBe(orgId);
    expect(decoded?.routeId).toBe(routeId);
    expect(decoded?.checkpointId).toBe(checkpointId);
    expect(decoded?.nonce).toBe(payload.nonce);
    expect(decoded?.hmac).toBe(payload.hmac);
  });

  it('verifies valid HMAC payload correctly', () => {
    const payload = generateCheckpointPayload({ orgId, routeId, checkpointId });
    const isValid = verifyCheckpointPayload(payload);
    expect(isValid).toBe(true);
  });

  it('rejects tampered or forged checkpoint payload', () => {
    const payload = generateCheckpointPayload({ orgId, routeId, checkpointId });

    // Tamper with checkpointId
    const tampered = { ...payload, checkpointId: 'cp_gate_fake' };
    expect(verifyCheckpointPayload(tampered)).toBe(false);

    // Tamper with HMAC
    const tamperedHmac = { ...payload, hmac: '0'.repeat(64) };
    expect(verifyCheckpointPayload(tamperedHmac)).toBe(false);

    // Corrupted payload format
    expect(decodeCheckpointQrString('invalid:prefix:string')).toBeNull();
  });

  it('generates printable SVG placard markup with route and checkpoint details', () => {
    const svg = generateCheckpointPlacardSvg({
      checkpointName: 'North Perimeter Tower',
      routeName: 'Night Watch Loop',
      orderIndex: 2,
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain('GATEFLOW SECURITY CHECKPOINT');
    expect(svg).toContain('Night Watch Loop');
    expect(svg).toContain('#3 — North Perimeter Tower');
    expect(svg).toContain('</svg>');
  });
});
