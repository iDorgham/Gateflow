import {
  buildRetentionCutoffs,
  retentionApplyAllowed,
  subtractUtcMonths,
  validateRetentionMonths,
} from './retention-policy';

const policy = {
  scanLogRetentionMonths: 6,
  visitorHistoryRetentionMonths: 12,
  idArtifactRetentionMonths: 1,
  incidentRetentionMonths: null,
  retentionLegalHold: false,
};

describe('retention policy', () => {
  test('builds deterministic UTC cutoffs and preserves indefinite categories', () => {
    const cutoffs = buildRetentionCutoffs(
      policy,
      new Date('2026-08-04T12:00:00.000Z')
    );
    expect(cutoffs.scanLogs?.toISOString()).toBe('2026-02-04T12:00:00.000Z');
    expect(cutoffs.visitorHistory?.toISOString()).toBe(
      '2025-08-04T12:00:00.000Z'
    );
    expect(cutoffs.idArtifacts?.toISOString()).toBe('2026-07-04T12:00:00.000Z');
    expect(cutoffs.incidents).toBeNull();
  });

  test('legal hold fails closed for every category', () => {
    const held = { ...policy, retentionLegalHold: true };
    expect(buildRetentionCutoffs(held, new Date())).toEqual({
      scanLogs: null,
      visitorHistory: null,
      idArtifacts: null,
      incidents: null,
    });
    expect(retentionApplyAllowed(held, 'APPLY_RETENTION')).toBe(false);
  });

  test('apply requires an exact confirmation token', () => {
    expect(retentionApplyAllowed(policy, undefined)).toBe(false);
    expect(retentionApplyAllowed(policy, 'yes')).toBe(false);
    expect(retentionApplyAllowed(policy, 'APPLY_RETENTION')).toBe(true);
  });

  test('rejects unsafe retention intervals', () => {
    for (const value of [0, -1, 1.5, 121])
      expect(() => validateRetentionMonths(value)).toThrow();
    expect(() => validateRetentionMonths(null)).not.toThrow();
  });

  test('subtracts across year boundaries', () => {
    expect(
      subtractUtcMonths(new Date('2026-01-15T00:00:00.000Z'), 2).toISOString()
    ).toBe('2025-11-15T00:00:00.000Z');
  });

  test('clamps month-end dates to the shorter target month instead of rolling over', () => {
    expect(
      subtractUtcMonths(new Date('2026-03-31T00:00:00.000Z'), 1).toISOString()
    ).toBe('2026-02-28T00:00:00.000Z');
  });

  test('clamps into February of a leap year at day 29', () => {
    expect(
      subtractUtcMonths(new Date('2024-03-31T00:00:00.000Z'), 1).toISOString()
    ).toBe('2024-02-29T00:00:00.000Z');
  });

  test('preserves the day when the target month is long enough', () => {
    expect(
      subtractUtcMonths(new Date('2026-05-31T00:00:00.000Z'), 1).toISOString()
    ).toBe('2026-04-30T00:00:00.000Z');
  });
});
