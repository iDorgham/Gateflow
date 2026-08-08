/**
 * Regression test: buildScanLogWhere() must always filter out soft-deleted
 * ScanLog rows. This helper backs analytics/scan-outcome and
 * analytics/visitor-type — a missing deletedAt filter here would silently
 * leak soft-deleted (e.g. reset-tenant) scan data back into analytics.
 */
export {};

jest.mock('@gate-access/db', () => ({
  prisma: {},
}));

import {
  buildScanLogWhere,
  type ValidatedAnalyticsContext,
} from './analytics-query';

function makeCtx(
  overrides: Partial<ValidatedAnalyticsContext> = {}
): ValidatedAnalyticsContext {
  return {
    orgId: 'org_1',
    dateFrom: '2026-01-01',
    dateTo: '2026-01-31',
    projectId: '',
    gateId: '',
    unitType: '',
    dateFromDate: new Date('2026-01-01'),
    dateToDate: new Date('2026-01-31'),
    ...overrides,
  };
}

describe('buildScanLogWhere', () => {
  it('filters out soft-deleted ScanLog rows', () => {
    const where = buildScanLogWhere(makeCtx());
    expect(where.deletedAt).toBeNull();
  });

  it('also filters out soft-deleted QRCode rows via the nested qrCode filter', () => {
    const where = buildScanLogWhere(makeCtx());
    expect((where.qrCode as { deletedAt: null }).deletedAt).toBeNull();
  });

  it('preserves deletedAt: null when project/gate filters are applied', () => {
    const where = buildScanLogWhere(
      makeCtx({ projectId: 'proj_1', gateId: 'gate_1' })
    );
    expect(where.deletedAt).toBeNull();
    expect((where.qrCode as { deletedAt: null }).deletedAt).toBeNull();
    expect(where.gateId).toBe('gate_1');
  });
});
