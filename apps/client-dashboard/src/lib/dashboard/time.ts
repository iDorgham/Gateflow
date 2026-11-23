/**
 * Time-zone helpers for the operations overview.
 *
 * Organizations do not store a time zone yet (the Settings > Timezone select is
 * not persisted). Until `Organization.timezone` exists, every org is bucketed in
 * one deployment-wide zone so that "today", hourly and daily charts agree with
 * each other and with what a guard sees on the wall clock.
 *
 * This is the single seam to change when the per-org field lands.
 */
export const DEFAULT_DASHBOARD_TIMEZONE = 'Africa/Cairo';

export function getDashboardTimeZone(): string {
  const tz = process.env.GATEFLOW_DEFAULT_TIMEZONE;
  if (tz && isValidTimeZone(tz)) return tz;
  return DEFAULT_DASHBOARD_TIMEZONE;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
  };
}

/** Offset of `timeZone` from UTC at `date`, in milliseconds (Cairo = +2h/+3h). */
export function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const p = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
  return asUtc - date.getTime();
}

/** UTC instant of local midnight (in `timeZone`) for the day containing `date`. */
export function startOfZonedDay(date: Date, timeZone: string): Date {
  const p = getZonedParts(date, timeZone);
  const localMidnightAsUtc = Date.UTC(p.year, p.month - 1, p.day);
  // Use the offset at midnight itself so DST transitions resolve correctly.
  const guess = new Date(
    localMidnightAsUtc - getTimeZoneOffsetMs(date, timeZone)
  );
  return new Date(localMidnightAsUtc - getTimeZoneOffsetMs(guess, timeZone));
}

/** UTC instant of the start of the local hour containing `date`. */
export function startOfZonedHour(date: Date): Date {
  // Every IANA zone in MENA uses whole-hour offsets, so truncating the UTC
  // hour also truncates the local hour.
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

/** `YYYY-MM-DD` key of the local day for `date`. Matches the SQL bucket key. */
export function zonedDayKey(date: Date, timeZone: string): string {
  const p = getZonedParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

/** `YYYY-MM-DD HH` key of the local hour for `date`. Matches the SQL bucket key. */
export function zonedHourKey(date: Date, timeZone: string): string {
  const p = getZonedParts(date, timeZone);
  return `${zonedDayKey(date, timeZone)} ${String(p.hour).padStart(2, '0')}`;
}
