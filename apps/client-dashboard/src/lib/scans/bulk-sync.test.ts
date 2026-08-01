/* eslint-disable @typescript-eslint/no-explicit-any */
import { processBulkScans, type ScanInput } from './bulk-sync';

type MockTx = {
  scanLog: {
    findMany: jest.Mock<any, any>;
    createMany: jest.Mock<any, any>;
    update: jest.Mock<any, any>;
  };
  qRCode: {
    findMany: jest.Mock<any, any>;
  };
  shiftLog: {
    findMany: jest.Mock<any, any>;
  };
};

describe('processBulkScans', () => {
  let mockTx: MockTx;

  beforeEach(() => {
    mockTx = {
      scanLog: {
        findMany: jest.fn(() => Promise.resolve([])),
        createMany: jest.fn(() => Promise.resolve({ count: 0 })),
        update: jest.fn(() => Promise.resolve({})),
      },
      qRCode: {
        findMany: jest.fn(() => Promise.resolve([])),
      },
      shiftLog: {
        findMany: jest.fn(() => Promise.resolve([])),
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should sync new scans successfully', async () => {
    const scans: ScanInput[] = [
      {
        id: 'scan-1',
        scanUuid: 'uuid-1',
        qrCode: 'qr-1',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] },
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-1');
    expect(result.failed).toHaveLength(0);
    expect(mockTx.scanLog.createMany).toHaveBeenCalledTimes(1);

    const createCall = mockTx.scanLog.createMany.mock.calls[0];
    const createdData = createCall[0].data;
    expect(createdData).toHaveLength(1);
    expect(createdData[0].scanUuid).toBe('uuid-1');
    expect(createdData[0].qrCodeId).toBe('qr-id-1');
    expect(createdData[0].auditTrail).toHaveLength(1);
    expect(createdData[0].auditTrail[0].action).toBe('sync_create');
  });

  it('should handle idempotent duplicates (same scanUuid)', async () => {
    const scans: ScanInput[] = [
      {
        id: 'scan-1',
        scanUuid: 'uuid-existing',
        qrCode: 'qr-1',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    mockTx.scanLog.findMany.mockResolvedValue([
      { id: 'db-scan-1', scanUuid: 'uuid-existing' },
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-1');
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
    expect(mockTx.scanLog.update).not.toHaveBeenCalled();
  });

  it('should fail if QR code not found', async () => {
    const scans: ScanInput[] = [
      {
        id: 'scan-1',
        scanUuid: 'uuid-1',
        qrCode: 'qr-missing',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].error).toBe('QR code not found');
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
  });

  it('should resolve LWW conflict (Incoming Newer)', async () => {
    const existingTime = new Date('2023-01-01T10:00:00Z');
    const incomingTime = new Date('2023-01-01T10:05:00Z').toISOString();

    const scans: ScanInput[] = [
      {
        id: 'scan-new',
        scanUuid: 'uuid-new',
        qrCode: 'qr-1',
        scannedAt: incomingTime,
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      {
        id: 'qr-id-1',
        code: 'qr-1',
        scanLogs: [
          {
            id: 'scan-existing',
            scannedAt: existingTime,
            auditTrail: [{ action: 'original' }],
          },
        ],
      },
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.synced).toContain('scan-new');
    expect(result.conflicted).toHaveLength(1);
    expect(result.conflicted[0].reason).toContain(
      'LWW resolved - incoming newer'
    );

    expect(mockTx.scanLog.update).toHaveBeenCalledTimes(1);
    const updateCall = mockTx.scanLog.update.mock.calls[0];
    expect(updateCall[0].where.id).toBe('scan-existing');
    expect(updateCall[0].data.scannedAt).toEqual(new Date(incomingTime));
    const newTrail = updateCall[0].data.auditTrail;
    expect(newTrail).toHaveLength(2);
    expect(newTrail[1].action).toBe('sync_resolve');
  });

  it('should resolve Server Wins (Existing Newer)', async () => {
    const existingTime = new Date('2023-01-01T10:05:00Z');
    const incomingTime = new Date('2023-01-01T10:00:00Z').toISOString();

    const scans: ScanInput[] = [
      {
        id: 'scan-old',
        scanUuid: 'uuid-old',
        qrCode: 'qr-1',
        scannedAt: incomingTime,
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      {
        id: 'qr-id-1',
        code: 'qr-1',
        scanLogs: [
          {
            id: 'scan-existing',
            scannedAt: existingTime,
            auditTrail: [{ action: 'original' }],
          },
        ],
      },
    ]);

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.conflicted).toHaveLength(1);
    expect(result.conflicted[0].reason).toContain('existing record newer');

    expect(mockTx.scanLog.update).toHaveBeenCalledTimes(1);
    const updateCall = mockTx.scanLog.update.mock.calls[0];
    expect(updateCall[0].data.scannedAt).toBeUndefined();
    const newTrail = updateCall[0].data.auditTrail;
    expect(newTrail).toHaveLength(2);
  });

  it('should batch creates correctly', async () => {
    const scans: ScanInput[] = [
      {
        id: 's1',
        scanUuid: 'u1',
        qrCode: 'q1',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'g1',
      },
      {
        id: 's2',
        scanUuid: 'u2',
        qrCode: 'q2',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'g1',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qid1', code: 'q1', scanLogs: [] },
      { id: 'qid2', code: 'q2', scanLogs: [] },
    ]);

    await processBulkScans(scans, mockTx as any);

    expect(mockTx.scanLog.createMany).toHaveBeenCalledTimes(1);
    expect(mockTx.scanLog.createMany.mock.calls[0][0].data).toHaveLength(2);
  });

  it('rejects scans when shiftLogId is not owned/open for the gate (with context)', async () => {
    const scannedAt = new Date().toISOString();
    const scans: ScanInput[] = [
      {
        id: 'scan-shift-bad',
        scanUuid: 'uuid-shift-bad',
        qrCode: 'qr-1',
        scannedAt,
        status: 'SUCCESS',
        gateId: 'gate-1',
        shiftLogId: 'shift-forged',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] },
    ]);
    mockTx.shiftLog.findMany.mockResolvedValue([]);

    const result = await processBulkScans(scans, mockTx as any, {
      organizationId: 'org_1',
      guardId: 'guard_1',
    });

    expect(result.failed).toEqual([
      {
        id: 'scan-shift-bad',
        error: 'Invalid or unauthorized shiftLogId for this gate',
      },
    ]);
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
  });

  it('rejects scans without shift attribution when auth context is present', async () => {
    const scans: ScanInput[] = [
      {
        id: 'scan-no-shift',
        qrCode: 'qr-1',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
      },
    ];

    const result = await processBulkScans(scans, mockTx as any, {
      organizationId: 'org_1',
      guardId: 'guard_1',
    });

    expect(result.failed).toEqual([
      {
        id: 'scan-no-shift',
        error: 'shiftLogId is required for bulk sync',
      },
    ]);
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
  });

  it('rejects client shift attribution when auth context is absent', async () => {
    const scans: ScanInput[] = [
      {
        id: 'scan-forged',
        qrCode: 'qr-1',
        scannedAt: new Date().toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
        shiftLogId: 'shift-forged',
      },
    ];

    const result = await processBulkScans(scans, mockTx as any);

    expect(result.failed[0]?.error).toMatch(/organization context is required/);
    expect(mockTx.shiftLog.findMany).not.toHaveBeenCalled();
    expect(mockTx.scanLog.createMany).not.toHaveBeenCalled();
  });

  it('allows modest device clock skew for an open shift', async () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] },
    ]);
    mockTx.shiftLog.findMany.mockResolvedValue([
      {
        id: 'shift-open',
        gateId: 'gate-1',
        startTime: new Date(now - 60_000),
        endTime: null,
      },
    ]);

    const result = await processBulkScans(
      [
        {
          id: 'scan-ahead',
          qrCode: 'qr-1',
          scannedAt: new Date(now + 2 * 60_000).toISOString(),
          status: 'SUCCESS',
          gateId: 'gate-1',
          shiftLogId: 'shift-open',
        },
      ],
      mockTx as any,
      { organizationId: 'org_1', guardId: 'guard_1' }
    );

    expect(result.synced).toEqual(['scan-ahead']);
    expect(result.failed).toEqual([]);
    expect(mockTx.shiftLog.findMany).toHaveBeenCalledTimes(1);
  });

  it('syncs a historical scan captured within an owned closed shift', async () => {
    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] },
    ]);
    mockTx.shiftLog.findMany.mockResolvedValue([
      {
        id: 'shift-closed',
        gateId: 'gate-1',
        startTime: new Date('2026-08-01T09:00:00.000Z'),
        endTime: new Date('2026-08-01T17:00:00.000Z'),
      },
    ]);

    const result = await processBulkScans(
      [
        {
          id: 'scan-offline',
          qrCode: 'qr-1',
          scannedAt: '2026-08-01T16:59:00.000Z',
          status: 'SUCCESS',
          gateId: 'gate-1',
          shiftLogId: 'shift-closed',
        },
      ],
      mockTx as any,
      { organizationId: 'org_1', guardId: 'guard_1' }
    );

    expect(result.synced).toEqual(['scan-offline']);
    expect(result.failed).toEqual([]);
  });

  it('does not apply open-shift clock skew after a shift has closed', async () => {
    mockTx.qRCode.findMany.mockResolvedValue([
      { id: 'qr-id-1', code: 'qr-1', scanLogs: [] },
    ]);
    mockTx.shiftLog.findMany.mockResolvedValue([
      {
        id: 'shift-closed',
        gateId: 'gate-1',
        startTime: new Date('2026-08-01T09:00:00.000Z'),
        endTime: new Date('2026-08-01T17:00:00.000Z'),
      },
    ]);

    const result = await processBulkScans(
      [
        {
          id: 'scan-after-close',
          qrCode: 'qr-1',
          scannedAt: '2026-08-01T17:02:00.000Z',
          status: 'SUCCESS',
          gateId: 'gate-1',
          shiftLogId: 'shift-closed',
        },
      ],
      mockTx as any,
      { organizationId: 'org_1', guardId: 'guard_1' }
    );

    expect(result.synced).toEqual([]);
    expect(result.failed[0]?.error).toBe(
      'Scan time is after the referenced shift ended'
    );
  });

  it('records verified shiftLogId on LWW audit entries', async () => {
    const now = Date.now();
    const older = new Date(now - 2 * 60 * 60 * 1000);
    const newer = new Date(now - 60 * 60 * 1000);
    const scans: ScanInput[] = [
      {
        id: 'scan-lww',
        scanUuid: 'uuid-lww',
        qrCode: 'qr-1',
        scannedAt: newer.toISOString(),
        status: 'SUCCESS',
        gateId: 'gate-1',
        shiftLogId: 'shift_ok',
      },
    ];

    mockTx.qRCode.findMany.mockResolvedValue([
      {
        id: 'qr-id-1',
        code: 'qr-1',
        scanLogs: [
          {
            id: 'existing-1',
            scannedAt: older,
            auditTrail: [
              {
                timestamp: older.toISOString(),
                action: 'sync_create',
                resolvedBy: 'client',
                details: {},
              },
            ],
          },
        ],
      },
    ]);
    mockTx.shiftLog.findMany.mockResolvedValue([
      {
        id: 'shift_ok',
        gateId: 'gate-1',
        startTime: new Date(now - 3 * 60 * 60 * 1000),
        endTime: null,
      },
    ]);

    const result = await processBulkScans(scans, mockTx as any, {
      organizationId: 'org_1',
      guardId: 'guard_1',
    });

    expect(result.synced).toContain('scan-lww');
    const trail = mockTx.scanLog.update.mock.calls[0][0].data.auditTrail;
    expect(trail[trail.length - 1].details.shiftLogId).toBe('shift_ok');
  });
});
