import { QueuedScanSchema } from './scan-event';

const queuedScan = {
  id: 'scan-1',
  scanUuid: '123e4567-e89b-42d3-a456-426614174000',
  qrCode: 'qr-payload',
  gateId: 'gate-1',
  scannedAt: '2026-08-01T12:00:00.000Z',
  synced: false,
  retryCount: 0,
};

describe('QueuedScanSchema', () => {
  it('preserves shift attribution', () => {
    expect(
      QueuedScanSchema.parse({ ...queuedScan, shiftLogId: 'shift-1' })
    ).toMatchObject({ shiftLogId: 'shift-1' });
  });

  it('rejects an empty shift attribution', () => {
    expect(
      QueuedScanSchema.safeParse({ ...queuedScan, shiftLogId: '' }).success
    ).toBe(false);
  });
});
