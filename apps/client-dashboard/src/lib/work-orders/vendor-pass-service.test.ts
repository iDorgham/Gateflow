import {
  generateVendorAccessPass,
  verifyVendorAccessPass,
  VendorPassRequest,
} from './vendor-pass-service';

describe('vendor-pass-service', () => {
  const SECRET = 'test-secret-key-123';
  const MOCK_REQUEST: VendorPassRequest = {
    workOrderId: 'wo-101',
    vendorName: 'Schneider Electric Services',
    technicianName: 'Tarek Mahmoud',
    organizationId: 'org-palm-hills',
    allowedGateIds: ['gate-north-01', 'gate-service-03'],
    validFrom: '2026-08-24T08:00:00Z',
    validUntil: '2026-08-24T16:00:00Z',
  };

  it('generates valid signed vendor access pass', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);

    expect(pass.type).toBe('VENDOR_WORK_ORDER');
    expect(pass.woId).toBe('wo-101');
    expect(pass.vendor).toBe('Schneider Electric Services');
    expect(pass.tech).toBe('Tarek Mahmoud');
    expect(pass.gates).toContain('gate-north-01');
    expect(pass.sig).toBeDefined();
    expect(pass.sig.length).toBe(64); // SHA256 hex string length
  });

  it('grants access for valid scan during active time window at allowed gate', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);
    const scanTime = Math.floor(
      new Date('2026-08-24T10:00:00Z').getTime() / 1000
    );

    const result = verifyVendorAccessPass(
      pass,
      'gate-north-01',
      scanTime,
      SECRET
    );
    expect(result.valid).toBe(true);
    expect(result.code).toBe('GRANTED');
  });

  it('denies access if pass is scanned prior to validFrom time', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);
    const earlyScanTime = Math.floor(
      new Date('2026-08-24T07:00:00Z').getTime() / 1000
    );

    const result = verifyVendorAccessPass(
      pass,
      'gate-north-01',
      earlyScanTime,
      SECRET
    );
    expect(result.valid).toBe(false);
    expect(result.code).toBe('NOT_YET_VALID');
  });

  it('denies access if pass has expired past validUntil time', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);
    const lateScanTime = Math.floor(
      new Date('2026-08-24T17:00:00Z').getTime() / 1000
    );

    const result = verifyVendorAccessPass(
      pass,
      'gate-north-01',
      lateScanTime,
      SECRET
    );
    expect(result.valid).toBe(false);
    expect(result.code).toBe('EXPIRED');
  });

  it('denies access if scanned at an unauthorized gate checkpoint', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);
    const scanTime = Math.floor(
      new Date('2026-08-24T10:00:00Z').getTime() / 1000
    );

    const result = verifyVendorAccessPass(
      pass,
      'gate-vip-south',
      scanTime,
      SECRET
    );
    expect(result.valid).toBe(false);
    expect(result.code).toBe('GATE_NOT_ALLOWED');
  });

  it('detects tampering and rejects invalid HMAC signature', () => {
    const pass = generateVendorAccessPass(MOCK_REQUEST, SECRET);
    const scanTime = Math.floor(
      new Date('2026-08-24T10:00:00Z').getTime() / 1000
    );

    const tamperedPass = {
      ...pass,
      gates: ['*'], // Attacker attempting privilege escalation
    };

    const result = verifyVendorAccessPass(
      tamperedPass,
      'gate-vip-south',
      scanTime,
      SECRET
    );
    expect(result.valid).toBe(false);
    expect(result.code).toBe('INVALID_SIGNATURE');
  });
});
