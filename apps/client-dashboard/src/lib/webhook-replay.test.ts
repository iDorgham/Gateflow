export {};

import crypto from 'crypto';

const mockExecuteRaw = jest.fn();
const mockAuditFindFirst = jest.fn();
const mockAuditCreate = jest.fn();
const mockTransaction = jest.fn(async (callback: (tx: unknown) => unknown) =>
  callback({
    $executeRaw: mockExecuteRaw,
    auditLog: {
      findFirst: mockAuditFindFirst,
      create: mockAuditCreate,
    },
  })
);

jest.mock('@gate-access/db', () => ({
  prisma: {
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}));

import {
  runReplayProtectedWebhook,
  verifyWebhookEnvelope,
} from './webhook-replay';

const NOW = new Date('2026-07-25T12:00:00.000Z');
const SECRET = 'webhook-test-secret-at-least-32-chars';
const RAW_BODY = '{"organizationId":"org-1"}';
const EVENT_ID = 'evt_12345678';

describe('verifyWebhookEnvelope', () => {
  it('accepts a fresh event whose ID is covered by the signature', () => {
    const timestamp = NOW.toISOString();
    const signature = crypto
      .createHmac('sha256', SECRET)
      .update(`${timestamp}.${EVENT_ID}.${RAW_BODY}`)
      .digest('hex');

    expect(
      verifyWebhookEnvelope({
        eventId: EVENT_ID,
        now: NOW,
        rawBody: RAW_BODY,
        secret: SECRET,
        signature,
        timestamp,
      })
    ).toBe(true);
  });

  it('rejects stale and excessively future-dated events', () => {
    for (const timestamp of [
      new Date(NOW.getTime() - 5 * 60_000 - 1).toISOString(),
      new Date(NOW.getTime() + 5 * 60_000 + 1).toISOString(),
    ]) {
      const signature = crypto
        .createHmac('sha256', SECRET)
        .update(`${timestamp}.${EVENT_ID}.${RAW_BODY}`)
        .digest('hex');

      expect(
        verifyWebhookEnvelope({
          eventId: EVENT_ID,
          now: NOW,
          rawBody: RAW_BODY,
          secret: SECRET,
          signature,
          timestamp,
        })
      ).toBe(false);
    }
  });

  it('rejects an event ID changed after signing', () => {
    const timestamp = NOW.toISOString();
    const signature = crypto
      .createHmac('sha256', SECRET)
      .update(`${timestamp}.${EVENT_ID}.${RAW_BODY}`)
      .digest('hex');

    expect(
      verifyWebhookEnvelope({
        eventId: 'evt_tampered',
        now: NOW,
        rawBody: RAW_BODY,
        secret: SECRET,
        signature,
        timestamp,
      })
    ).toBe(false);
  });
});

describe('runReplayProtectedWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditFindFirst.mockResolvedValue(null);
    mockAuditCreate.mockResolvedValue({ id: 'audit-1' });
    mockExecuteRaw.mockResolvedValue(1);
  });

  it('runs work and records the marker in one transaction', async () => {
    const work = jest.fn().mockResolvedValue({ id: 'created-1' });

    const result = await runReplayProtectedWebhook(
      {
        eventId: EVENT_ID,
        organizationId: 'org-1',
        provider: 'perimeter',
      },
      work
    );

    expect(result).toEqual({ duplicate: false, value: { id: 'created-1' } });
    expect(work).toHaveBeenCalledTimes(1);
    expect(mockAuditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'WEBHOOK_EVENT_PROCESSED',
        entityId: EVENT_ID,
        organizationId: 'org-1',
      }),
    });
  });

  it('returns duplicate without running business work', async () => {
    mockAuditFindFirst.mockResolvedValue({ id: 'audit-existing' });
    const work = jest.fn();

    const result = await runReplayProtectedWebhook(
      {
        eventId: EVENT_ID,
        organizationId: 'org-1',
        provider: 'whatsapp',
      },
      work
    );

    expect(result).toEqual({ duplicate: true });
    expect(work).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  it('does not create a replay marker when business work fails', async () => {
    const work = jest.fn().mockRejectedValue(new Error('downstream failed'));

    await expect(
      runReplayProtectedWebhook(
        {
          eventId: EVENT_ID,
          organizationId: 'org-1',
          provider: 'perimeter',
        },
        work
      )
    ).rejects.toThrow('downstream failed');

    expect(mockAuditCreate).not.toHaveBeenCalled();
  });
});
