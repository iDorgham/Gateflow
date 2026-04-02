export {};

import { verifyQRSignature } from '@gate-access/types';
import {
  buildSignedVisitorQRCodeString,
  deterministicScanUuid,
  RELATIONAL_SEED_CHAIN_DEPTH,
  scanLogWhereForOrganization,
} from './relational-chain-seed';

const TEST_SECRET = '0123456789abcdef0123456789abcdef'; // 32 chars

describe('relational-chain-seed', () => {
  test('deterministicScanUuid: unique for 2000 indices at fixed seed', () => {
    const seed = 424242;
    const set = new Set<string>();
    for (let i = 0; i < 2000; i++) {
      set.add(deterministicScanUuid(seed, i));
    }
    expect(set.size).toBe(2000);
  });

  test('deterministicScanUuid: stable for same (seed, index)', () => {
    expect(deterministicScanUuid(7, 3)).toBe(deterministicScanUuid(7, 3));
  });

  test('buildSignedVisitorQRCodeString + verifyQRSignature round-trip', () => {
    const qrId = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    const orgId = 'org_seed_test_1';
    const nonce = '123e4567-e89b-12d3-a456-426614174000';
    const issuedAt = '2026-06-01T12:00:00.000Z';
    const code = buildSignedVisitorQRCodeString({
      qrId,
      organizationId: orgId,
      maxUses: 10,
      expiresAt: null,
      issuedAt,
      nonce,
      secret: TEST_SECRET,
    });
    const v = verifyQRSignature(code, TEST_SECRET);
    expect(v.valid).toBe(true);
    if (v.valid) {
      expect(v.payload.qrId).toBe(qrId);
      expect(v.payload.organizationId).toBe(orgId);
      expect(v.payload.type).toBe('VISITOR');
    }
  });

  test('verifyQRSignature rejects tampered signature', () => {
    const code = buildSignedVisitorQRCodeString({
      qrId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      organizationId: 'org_tamper',
      maxUses: 1,
      expiresAt: null,
      issuedAt: '2026-06-01T00:00:00.000Z',
      nonce: '223e4567-e89b-12d3-a456-426614174001',
      secret: TEST_SECRET,
    });
    const lastDot = code.lastIndexOf('.');
    const tampered =
      code.slice(0, lastDot + 1) +
      (code.charCodeAt(lastDot + 1) === 48 ? '1' : '0') +
      code.slice(lastDot + 2);
    const v = verifyQRSignature(tampered, TEST_SECRET);
    expect(v.valid).toBe(false);
    if (!v.valid) {
      expect(v.reason).toBe('INVALID_SIGNATURE');
    }
  });

  test('scanLogWhereForOrganization scopes via nested qrCode.organizationId', () => {
    expect(scanLogWhereForOrganization('org_x')).toEqual({
      qrCode: { organizationId: 'org_x', deletedAt: null },
    });
  });

  test('RELATIONAL_SEED_CHAIN_DEPTH documents seven entity layers', () => {
    expect(RELATIONAL_SEED_CHAIN_DEPTH).toBe(7);
  });
});
