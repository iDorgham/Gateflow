import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { processBulkScans, type ScanInput } from './bulk-sync';

// Mock types
type MockTx = {
  scanLog: {
    findMany: ReturnType<typeof mock>;
    createMany: ReturnType<typeof mock>;
    update: ReturnType<typeof mock>;
  };
  qRCode: {
    findMany: ReturnType<typeof mock>;
  };
};

describe('processBulkScans', () => {
  let mockTx: MockTx;

  beforeEach(() => {
    mockTx = {
      scanLog: {
        findMany: mock(() => Promise.resolve([])),
        createMany: mock(() => Promise.resolve({ count: 0 })),
        update: mock(() => Promise.resolve({})),
      },
      qRCode: {
        findMany: mock(() => Promise.resolve([])),
      },
    };
  });

  test('should sync new scans successfully', async () => {
    const scans: ScanInput[] = [{
      id: 'scan-1',
      scanUuid: 'uuid-1',
      qrCode: 'qr-1',
      scannedAt: new Date().toISOString(),
      status: 'SUCCESS',
      gateId: 'gate-1',
    }];

    // Mock QR code exists
    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] }
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-1');
    expect(result.failed).toHaveLength(0);
    expect(mockTx.scanLog.createMany).toHaveBeenCalledTimes(1);

    // Verify data passed to createMany
    const createCall = mockTx.scanLog.createMany.mock.calls[0];
    const createdData = createCall[0].data;
    expect(createdData).toHaveLength(1);
    expect(createdData[0].scanUuid).toBe('uuid-1');
    expect(createdData[0].qrCodeId).toBe('qr-id-1');
    expect(createdData[0].auditTrail).toHaveLength(1);
    expect(createdData[0].auditTrail[0].action).toBe('sync_create');
  });

  test('should handle idempotent duplicates (same scanUuid)', async () => {
    const scans: ScanInput[] = [{
      id: 'scan-1',
      scanUuid: 'uuid-existing',
      qrCode: 'qr-1',
      scannedAt: new Date().toISOString(),
      status: 'SUCCESS',
      gateId: 'gate-1',
    }];

    // Mock existing UUID
    mockTx.scanLog.findMany.mockResolvedValue([
      { id: 'db-scan-1', scanUuid: 'uuid-existing' }
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-1');
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
    expect(mockTx.scanLog.update).not.toHaveBeenCalled();
  });

  test('should fail if QR code not found', async () => {
    const scans: ScanInput[] = [{
      id: 'scan-1',
      scanUuid: 'uuid-1',
      qrCode: 'qr-missing',
      scannedAt: new Date().toISOString(),
      status: 'SUCCESS',
      gateId: 'gate-1',
    }];

    mockTx.qRCode.findMany.mockResolvedValue([]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].error).toBe('QR code not found');
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
  });

  test('should resolve LWW conflict (Incoming Newer)', async () => {
    const existingTime = new Date('2023-01-01T10:00:00Z');
    const incomingTime = new Date('2023-01-01T10:05:00Z').toISOString();

    const scans: ScanInput[] = [{
      id: 'scan-new',
      scanUuid: 'uuid-new',
      qrCode: 'qr-1',
      scannedAt: incomingTime,
      status: 'SUCCESS',
      gateId: 'gate-1',
    }];

    mockTx.qRCode.findMany.mockResolvedValue([
      {
        id: 'qr-id-1',
        code: 'qr-1',
        scanLogs: [{
          id: 'scan-existing',
          scannedAt: existingTime,
          auditTrail: [{ action: 'original' }]
        }]
      }
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-new');
    expect(result.conflicted).toHaveLength(1);
    expect(result.conflicted[0].reason).toContain('LWW resolved - incoming newer');

    expect(mockTx.scanLog.update).toHaveBeenCalledTimes(1);
    const updateCall = mockTx.scanLog.update.mock.calls[0];
    expect(updateCall[0].where.id).toBe('scan-existing');
    expect(updateCall[0].data.scannedAt).toEqual(new Date(incomingTime));
    // Verify audit trail appended
    const newTrail = updateCall[0].data.auditTrail;
    expect(newTrail).toHaveLength(2);
    expect(newTrail[1].action).toBe('sync_resolve');
  });

  test('should resolve Server Wins (Existing Newer)', async () => {
    const existingTime = new Date('2023-01-01T10:05:00Z');
    const incomingTime = new Date('2023-01-01T10:00:00Z').toISOString();

    const scans: ScanInput[] = [{
      id: 'scan-old',
      scanUuid: 'uuid-old',
      qrCode: 'qr-1',
      scannedAt: incomingTime,
      status: 'SUCCESS',
      gateId: 'gate-1',
    }];

    mockTx.qRCode.findMany.mockResolvedValue([
      {
        id: 'qr-id-1',
        code: 'qr-1',
        scanLogs: [{
          id: 'scan-existing',
          scannedAt: existingTime,
          auditTrail: [{ action: 'original' }]
        }]
      }
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.conflicted).toHaveLength(1);
    expect(result.conflicted[0].reason).toContain('existing record newer');

    expect(mockTx.scanLog.update).toHaveBeenCalledTimes(1);
    // Should NOT update scannedAt
    const updateCall = mockTx.scanLog.update.mock.calls[0];
    expect(updateCall[0].data.scannedAt).toBeUndefined();
    // Should append audit trail
    const newTrail = updateCall[0].data.auditTrail;
    expect(newTrail).toHaveLength(2);
  });

  test('should batch creates correctly', async () => {
    const scans: ScanInput[] = [
      { id: 's1', scanUuid: 'u1', qrCode: 'q1', scannedAt: new Date().toISOString(), status: 'SUCCESS', gateId: 'g1' },
      { id: 's2', scanUuid: 'u2', qrCode: 'q2', scannedAt: new Date().toISOString(), status: 'SUCCESS', gateId: 'g1' },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qid1', code: 'q1', scanLogs: [] },
      { id: 'qid2', code: 'q2', scanLogs: [] },
    ]);

    await processBulkScans(scans, mockTx as any);

    expect(mockTx.scanLog.createMany).toHaveBeenCalledTimes(1);
    expect(mockTx.scanLog.createMany.mock.calls[0][0].data).toHaveLength(2);
  });
});
