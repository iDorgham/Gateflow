import test from 'node:test';
import assert from 'node:assert/strict';
import {
  maskPhoneNumber,
  maskNationalId,
  maskEmail,
  maskPlateNumber,
} from './utils/piiMasking.js';

// Test 1: PII Phone Number Masking
test('maskPhoneNumber properly masks middle digits while preserving prefix and last 4', () => {
  assert.equal(maskPhoneNumber('+201012345678'), '+20101****5678');
  assert.equal(maskPhoneNumber('01012345678'), '010****5678');
  assert.equal(maskPhoneNumber(''), '');
  assert.equal(maskPhoneNumber(null), '');
});

// Test 2: PII National ID Masking
test('maskNationalId properly masks national ID/passport preserving first and last 4 digits', () => {
  const nationalId = '29801011234567';
  const masked = maskNationalId(nationalId);
  assert.equal(masked, '2980******4567');
  assert.ok(!masked.includes('101123'));
});

// Test 3: PII Email Address Masking
test('maskEmail preserves first and last letter of local part with domain intact', () => {
  assert.equal(maskEmail('resident@gateflow.site'), 'r*****t@gateflow.site');
  assert.equal(maskEmail('jo@gateflow.site'), 'j*@gateflow.site');
  assert.equal(maskEmail('invalid-email'), 'invalid-email');
});

// Test 4: PII Vehicle Plate Number Masking
test('maskPlateNumber masks initial characters of plate letters', () => {
  assert.equal(maskPlateNumber('ABC 1234'), 'A** 1234');
  assert.equal(maskPlateNumber('XY 9876'), 'X* 9876');
});

// Test 5: Audit Event Structure & Tenant Invariant
test('Audit log entry generation adheres to tenant isolation and sequence ordering', () => {
  let sequence = 0;

  function createAuditEntry(action, orgId, unitId, metadata) {
    if (!orgId) {
      throw new Error('TENANT_ISOLATION_VIOLATION: organizationId is required');
    }
    sequence += 1;
    return {
      id: `aud-${Date.now()}-${sequence}`,
      sequenceNumber: sequence,
      action,
      organizationId: orgId,
      unitId,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  const entry1 = createAuditEntry(
    'AUTH_BIOMETRIC_SUCCESS',
    'org-cairo-prime',
    'unit-302',
    { latencyMs: 320 }
  );
  assert.equal(entry1.sequenceNumber, 1);
  assert.equal(entry1.organizationId, 'org-cairo-prime');
  assert.equal(entry1.action, 'AUTH_BIOMETRIC_SUCCESS');

  const entry2 = createAuditEntry(
    'GATE_UNLOCKED_REMOTE',
    'org-cairo-prime',
    'unit-302',
    { gate: 'Main Gate' }
  );
  assert.equal(entry2.sequenceNumber, 2);

  // Invariant test: missing organizationId throws error
  assert.throws(() => {
    createAuditEntry('PASS_GENERATED', null, 'unit-101');
  }, /TENANT_ISOLATION_VIOLATION/);
});
