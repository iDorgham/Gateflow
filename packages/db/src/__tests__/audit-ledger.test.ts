export {};

import {
  GENESIS_HASH,
  calculateAuditHash,
  canonicalizeJson,
  createChainedAuditLog,
  verifyAuditLedgerIntegrity,
} from '../audit-ledger';

describe('audit-ledger hash chaining and verification', () => {
  const ORG_ID = 'org_enterprise_123';
  const USER_ID = 'usr_admin_456';
  const FIXED_DATE = new Date('2026-08-26T12:00:00.000Z');

  test('canonicalizeJson() sorts nested keys deterministically', () => {
    const objA = { z: 1, a: { y: 2, b: 3 } };
    const objB = { a: { b: 3, y: 2 }, z: 1 };
    expect(canonicalizeJson(objA)).toBe(canonicalizeJson(objB));
    expect(canonicalizeJson(objA)).toBe('{"a":{"b":3,"y":2},"z":1}');
  });

  test('calculateAuditHash() produces deterministic SHA-256 hex string', () => {
    const hash = calculateAuditHash(GENESIS_HASH, {
      action: 'SECURITY_OVERRIDE',
      entityType: 'GATE',
      entityId: 'gate_north_01',
      organizationId: ORG_ID,
      userId: USER_ID,
      createdAt: FIXED_DATE,
      metadataPayload: { reason: 'Emergency medical vehicle' },
    });

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    // Same parameters produce identical hash
    expect(
      calculateAuditHash(GENESIS_HASH, {
        action: 'SECURITY_OVERRIDE',
        entityType: 'GATE',
        entityId: 'gate_north_01',
        organizationId: ORG_ID,
        userId: USER_ID,
        createdAt: FIXED_DATE,
        metadataPayload: { reason: 'Emergency medical vehicle' },
      })
    ).toBe(hash);
  });

  test('createChainedAuditLog() chains logs in sequential order', async () => {
    const inMemoryLogs: any[] = [];

    const mockClient = {
      auditLog: {
        findFirst: async ({ where }: any) => {
          const matching = inMemoryLogs
            .filter((l) => l.organizationId === where.organizationId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          return matching[0] ?? null;
        },
        create: async ({ data }: any) => {
          const log = {
            id: `log_${inMemoryLogs.length + 1}`,
            ...data,
          };
          inMemoryLogs.push(log);
          return log;
        },
        findMany: async ({ where }: any) => {
          return inMemoryLogs
            .filter((l) => l.organizationId === where.organizationId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        },
      },
    };

    // 1. Create first entry (Genesis)
    const log1 = await createChainedAuditLog(mockClient as any, {
      action: 'PASS_ISSUED',
      entityType: 'QR_CODE',
      entityId: 'qr_101',
      organizationId: ORG_ID,
      userId: USER_ID,
      createdAt: new Date('2026-08-26T12:00:00.000Z'),
      metadata: { visitorName: 'Ahmed Mansour' },
    });

    expect((log1.metadata as any)?.previousHash).toBe(GENESIS_HASH);
    expect((log1.metadata as any)?.seq).toBe(1);
    expect((log1.metadata as any)?.hash).toMatch(/^[0-9a-f]{64}$/);

    // 2. Create second entry
    const log2 = await createChainedAuditLog(mockClient as any, {
      action: 'SECURITY_GATE_OPENED',
      entityType: 'GATE',
      entityId: 'gate_01',
      organizationId: ORG_ID,
      userId: USER_ID,
      createdAt: new Date('2026-08-26T12:01:00.000Z'),
      metadata: { barrierId: 'barrier_A' },
    });

    expect((log2.metadata as any)?.previousHash).toBe(
      (log1.metadata as any)?.hash
    );
    expect((log2.metadata as any)?.seq).toBe(2);

    // 3. Verify integrity
    const verification = await verifyAuditLedgerIntegrity(
      mockClient as any,
      ORG_ID
    );
    expect(verification.isValid).toBe(true);
    expect(verification.totalEntries).toBe(2);
    expect(verification.tamperedId).toBeNull();
  });

  test('verifyAuditLedgerIntegrity() detects tampered data in historical log', async () => {
    const inMemoryLogs: any[] = [];

    const mockClient = {
      auditLog: {
        findFirst: async () => inMemoryLogs[inMemoryLogs.length - 1] ?? null,
        create: async ({ data }: any) => {
          const log = { id: `log_${inMemoryLogs.length + 1}`, ...data };
          inMemoryLogs.push(log);
          return log;
        },
        findMany: async () => inMemoryLogs,
      },
    };

    await createChainedAuditLog(mockClient as any, {
      action: 'PASS_REVOKED',
      entityType: 'QR_CODE',
      organizationId: ORG_ID,
      createdAt: new Date('2026-08-26T12:00:00.000Z'),
    });

    await createChainedAuditLog(mockClient as any, {
      action: 'SECURITY_ALERT',
      entityType: 'SYSTEM',
      organizationId: ORG_ID,
      createdAt: new Date('2026-08-26T12:05:00.000Z'),
    });

    // Tamper with first log action
    inMemoryLogs[0].action = 'PASS_TAMPERED';

    const verification = await verifyAuditLedgerIntegrity(
      mockClient as any,
      ORG_ID
    );
    expect(verification.isValid).toBe(false);
    expect(verification.tamperedIndex).toBe(0);
    expect(verification.tamperedId).toBe('log_1');
    expect(verification.errorReason).toContain('Payload signature mismatch');
  });

  test('verifyAuditLedgerIntegrity() detects broken hash chain links', async () => {
    const inMemoryLogs: any[] = [];

    const mockClient = {
      auditLog: {
        findFirst: async () => inMemoryLogs[inMemoryLogs.length - 1] ?? null,
        create: async ({ data }: any) => {
          const log = { id: `log_${inMemoryLogs.length + 1}`, ...data };
          inMemoryLogs.push(log);
          return log;
        },
        findMany: async () => inMemoryLogs,
      },
    };

    await createChainedAuditLog(mockClient as any, {
      action: 'ENTRY_1',
      entityType: 'GATE',
      organizationId: ORG_ID,
      createdAt: new Date('2026-08-26T12:00:00.000Z'),
    });

    await createChainedAuditLog(mockClient as any, {
      action: 'ENTRY_2',
      entityType: 'GATE',
      organizationId: ORG_ID,
      createdAt: new Date('2026-08-26T12:05:00.000Z'),
    });

    // Corrupt second entry's previousHash
    inMemoryLogs[1].metadata.previousHash = '0000broken0000';

    const verification = await verifyAuditLedgerIntegrity(
      mockClient as any,
      ORG_ID
    );
    expect(verification.isValid).toBe(false);
    expect(verification.tamperedIndex).toBe(1);
    expect(verification.tamperedId).toBe('log_2');
    expect(verification.errorReason).toContain('Hash chain broken');
  });
});
