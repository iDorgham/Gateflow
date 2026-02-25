/**
 * Unit tests for webhook-delivery.ts
 *
 * Coverage:
 *  1. deliverWebhookEvent — no webhooks (no-op), HMAC signature, retries,
 *                           error isolation between webhooks
 *  2. testWebhookDelivery — webhook not found, successful delivery
 */

import type { WebhookEvent } from '@gate-access/db';

// ─── Mocks (hoisted before imports) ──────────────────────────────────────────

const mockWebhookFindMany = jest.fn();
const mockWebhookFindFirst = jest.fn();
const mockDeliveryCreate = jest.fn();
const mockDeliveryUpdate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    webhook: {
      findMany: (...args: unknown[]) => mockWebhookFindMany(...args),
      findFirst: (...args: unknown[]) => mockWebhookFindFirst(...args),
    },
    webhookDelivery: {
      create: (...args: unknown[]) => mockDeliveryCreate(...args),
      update: (...args: unknown[]) => mockDeliveryUpdate(...args),
    },
  },
}));

// Return the plaintext secret unchanged so tests don't need a real encryption key.
jest.mock('./encryption', () => ({
  decryptField: (s: string) => s,
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import { deliverWebhookEvent, testWebhookDelivery } from './webhook-delivery';

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG_ID = 'org_test_1';
const WEBHOOK_ID = 'wh_test_1';
const WEBHOOK_URL = 'https://example.com/webhook';
const DELIVERY_ID = 'delivery_1';

const baseWebhook = { id: WEBHOOK_ID, url: WEBHOOK_URL, secret: 'plaintext-test-secret' };

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  mockDeliveryCreate.mockResolvedValue({ id: DELIVERY_ID });
  mockDeliveryUpdate.mockResolvedValue(undefined);
});

// ─── deliverWebhookEvent() ────────────────────────────────────────────────────

describe('deliverWebhookEvent()', () => {
  it('is a no-op when no webhooks are subscribed to the event', async () => {
    mockWebhookFindMany.mockResolvedValue([]);

    await deliverWebhookEvent(ORG_ID, 'QR_SCANNED' as WebhookEvent, { data: 1 });

    expect(mockDeliveryCreate).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends a POST with a valid HMAC-SHA256 signature on success', async () => {
    mockWebhookFindMany.mockResolvedValue([baseWebhook]);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('ok'),
    });

    await deliverWebhookEvent(ORG_ID, 'QR_SCANNED' as WebhookEvent, { scan: 'data' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe(WEBHOOK_URL);
    expect(init.method).toBe('POST');
    expect(init.headers['X-GateFlow-Signature']).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(init.headers['X-GateFlow-Event']).toBe('QR_SCANNED');
  });

  it('marks delivery as SUCCESS after a successful send', async () => {
    mockWebhookFindMany.mockResolvedValue([baseWebhook]);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('accepted'),
    });

    await deliverWebhookEvent(ORG_ID, 'QR_SCANNED' as WebhookEvent, {});

    expect(mockDeliveryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'SUCCESS', statusCode: 200 }),
      }),
    );
  });

  it('retries up to MAX_ATTEMPTS (3) and marks FAILED after all fail', async () => {
    jest.useFakeTimers();
    try {
      mockWebhookFindMany.mockResolvedValue([baseWebhook]);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('error'),
      });

      const deliverPromise = deliverWebhookEvent(ORG_ID, 'QR_SCANNED' as WebhookEvent, {});
      await jest.runAllTimersAsync();
      await deliverPromise;

      expect(global.fetch).toHaveBeenCalledTimes(3);
      const lastUpdate = mockDeliveryUpdate.mock.calls[mockDeliveryUpdate.mock.calls.length - 1][0];
      expect(lastUpdate.data.status).toBe('FAILED');
    } finally {
      jest.useRealTimers();
    }
  });

  it('isolates failures — a failing webhook does not block a succeeding one', async () => {
    mockWebhookFindMany.mockResolvedValue([
      { id: 'wh_good', url: 'https://good.example.com/wh', secret: 'sec1' },
      { id: 'wh_bad', url: 'https://bad.example.com/wh', secret: 'sec2' },
    ]);
    mockDeliveryCreate
      .mockResolvedValueOnce({ id: 'del_1' })
      .mockResolvedValueOnce({ id: 'del_2' });

    jest.useFakeTimers();
    try {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve('ok') })
        .mockRejectedValue(new Error('Network timeout'));

      const deliverPromise = deliverWebhookEvent(ORG_ID, 'QR_SCANNED' as WebhookEvent, {});
      await jest.runAllTimersAsync();
      await expect(deliverPromise).resolves.toBeUndefined();
    } finally {
      jest.useRealTimers();
    }
  });
});

// ─── testWebhookDelivery() ────────────────────────────────────────────────────

describe('testWebhookDelivery()', () => {
  it('returns a not-found result when the webhook does not exist', async () => {
    mockWebhookFindFirst.mockResolvedValue(null);

    const result = await testWebhookDelivery('nonexistent', ORG_ID);

    expect(result.success).toBe(false);
    expect(result.body).toBe('Webhook not found');
    expect(result.statusCode).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('delivers a test payload and returns success with statusCode', async () => {
    mockWebhookFindFirst.mockResolvedValue(baseWebhook);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('received'),
    });

    const result = await testWebhookDelivery(WEBHOOK_ID, ORG_ID);

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockDeliveryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'SUCCESS', statusCode: 200 }),
      }),
    );
  });

  it('returns failure result when the endpoint returns a non-2xx status', async () => {
    mockWebhookFindFirst.mockResolvedValue(baseWebhook);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('not found'),
    });

    const result = await testWebhookDelivery(WEBHOOK_ID, ORG_ID);

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(mockDeliveryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'FAILED' }),
      }),
    );
  });
});
