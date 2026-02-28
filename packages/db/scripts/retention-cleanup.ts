/**
 * Retention cleanup — placeholder script.
 *
 * When run (e.g. via cron), deletes or anonymizes data older than org retention settings:
 * - scanLogRetentionMonths
 * - idArtifactRetentionMonths
 * - incidentRetentionMonths
 * - visitorHistoryRetentionMonths (resident-facing visitor records)
 *
 * Org settings with null = keep indefinitely (no cleanup).
 *
 * Usage: ts-node packages/db/scripts/retention-cleanup.ts
 * Or: pnpm exec ts-node packages/db/scripts/retention-cleanup.ts
 *
 * TODO: Implement per-org iteration, cutoff date calculation, and soft-delete or hard-delete
 * per model. Consider legal hold flags before implementing.
 */

export function main(): void {
  console.log('[retention-cleanup] Placeholder. Implement when retention policies are enforced.');
}

main();
