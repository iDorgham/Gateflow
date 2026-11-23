import {
  getTimeZoneOffsetMs,
  startOfZonedDay,
  zonedDayKey,
  zonedHourKey,
  isValidTimeZone,
} from './time';

describe('dashboard time helpers', () => {
  it('computes Cairo offset in winter (UTC+2) and summer DST (UTC+3)', () => {
    expect(
      getTimeZoneOffsetMs(new Date('2026-01-15T12:00:00Z'), 'Africa/Cairo')
    ).toBe(2 * 3600_000);
    expect(
      getTimeZoneOffsetMs(new Date('2026-07-15T12:00:00Z'), 'Africa/Cairo')
    ).toBe(3 * 3600_000);
  });

  it('returns the UTC instant of local midnight', () => {
    // 01:30 Cairo on Jan 15 is 23:30 UTC on Jan 14; local midnight is 22:00 UTC Jan 14.
    const d = new Date('2026-01-14T23:30:00Z');
    expect(startOfZonedDay(d, 'Africa/Cairo').toISOString()).toBe(
      '2026-01-14T22:00:00.000Z'
    );
    expect(zonedDayKey(d, 'Africa/Cairo')).toBe('2026-01-15');
    expect(zonedHourKey(d, 'Africa/Cairo')).toBe('2026-01-15 01');
  });

  it('handles Riyadh (no DST) and UTC', () => {
    const d = new Date('2026-07-01T21:15:00Z');
    expect(startOfZonedDay(d, 'Asia/Riyadh').toISOString()).toBe(
      '2026-07-01T21:00:00.000Z'
    );
    expect(startOfZonedDay(d, 'UTC').toISOString()).toBe(
      '2026-07-01T00:00:00.000Z'
    );
  });

  it('rejects unknown zones', () => {
    expect(isValidTimeZone('Mars/Olympus')).toBe(false);
    expect(isValidTimeZone('Africa/Cairo')).toBe(true);
  });
});
