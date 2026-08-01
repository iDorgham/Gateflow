/**
 * duty-timer.ts
 *
 * Pure elapsed-duration formatting for the Master Scan Home Screen's live
 * shift widget. Kept dependency-free so it can tick every second without
 * re-deriving anything beyond the current timestamp.
 */

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Format the time elapsed between `startIso` and `nowMs` as `HH:MM:SS`.
 * Hours are not clamped to 24 — a shift can run past a day boundary.
 * A future, invalid, or unparseable `startIso` clamps to `00:00:00`
 * rather than showing a negative or NaN duration.
 */
export function formatElapsedDuration(startIso: string, nowMs: number): string {
  const startMs = new Date(startIso).getTime();
  const elapsedMs = Number.isNaN(startMs) ? 0 : Math.max(0, nowMs - startMs);
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}
