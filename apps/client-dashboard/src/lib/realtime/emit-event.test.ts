export {};

// Mock @gate-access/db before importing emit-event
const mockCreate = jest.fn();
const mockDeleteMany = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    eventLog: {
      create: (...args: unknown[]) => mockCreate(...args),
      deleteMany: (...args: unknown[]) => mockDeleteMany(...args),
    },
  },
  EventType: {
    QR_CREATED: 'QR_CREATED',
    QR_UPDATED: 'QR_UPDATED',
    QR_DELETED: 'QR_DELETED',
    SCAN_RECORDED: 'SCAN_RECORDED',
    CONTACT_CREATED: 'CONTACT_CREATED',
    CONTACT_UPDATED: 'CONTACT_UPDATED',
    VISITOR_QR_CREATED: 'VISITOR_QR_CREATED',
    VISITOR_QR_DELETED: 'VISITOR_QR_DELETED',
  },
}));

import { emitEvent, EventType } from './emit-event';

beforeEach(() => {
  jest.clearAllMocks();
  mockCreate.mockResolvedValue({ id: 'evt_1' });
  mockDeleteMany.mockResolvedValue({ count: 0 });
});

describe('emitEvent', () => {
  it('creates an EventLog row with the correct organizationId, type, and payload', async () => {
    const orgId = 'org_abc';
    const payload = { qrId: 'qr_123' };

    await emitEvent(orgId, EventType.QR_CREATED, payload);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        organizationId: orgId,
        type: EventType.QR_CREATED,
        payload,
      },
    });
  });

  it('uses an empty payload object when no payload is provided', async () => {
    await emitEvent('org_xyz', EventType.SCAN_RECORDED);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        organizationId: 'org_xyz',
        type: EventType.SCAN_RECORDED,
        payload: {},
      },
    });
  });

  it('does not throw when prisma.eventLog.create fails', async () => {
    mockCreate.mockRejectedValue(new Error('DB connection lost'));

    // Should resolve without throwing
    await expect(emitEvent('org_fail', EventType.QR_DELETED, { qrId: 'x' })).resolves.toBeUndefined();
  });

  it('calls pruneOldEvents (deleteMany) after a successful create', async () => {
    await emitEvent('org_prune', EventType.CONTACT_CREATED, { contactId: 'c1' });

    // Allow the fire-and-forget pruneOldEvents to settle
    await new Promise((r) => setTimeout(r, 10));

    expect(mockDeleteMany).toHaveBeenCalledTimes(1);
    const call = mockDeleteMany.mock.calls[0][0];
    expect(call.where.organizationId).toBe('org_prune');
    expect(call.where.createdAt.lt).toBeInstanceOf(Date);
    // Cutoff should be approximately 24h ago
    const cutoffMs = Date.now() - call.where.createdAt.lt.getTime();
    expect(cutoffMs).toBeGreaterThan(23 * 60 * 60 * 1000);
    expect(cutoffMs).toBeLessThan(25 * 60 * 60 * 1000);
  });

  it('does not throw when pruneOldEvents fails', async () => {
    mockDeleteMany.mockRejectedValue(new Error('prune failed'));

    await expect(emitEvent('org_prune_fail', EventType.QR_UPDATED, {})).resolves.toBeUndefined();
  });
});
