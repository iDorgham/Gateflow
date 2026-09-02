/**
 * Nightly PII purge & anonymization apply runner.
 *
 * This performs the actual retention batch described by the dry-run planner
 * (`retention-cleanup.ts`): it hard-deletes expired operational records and
 * anonymizes stale contacts/vehicles per each org's retention windows, always
 * respecting `retentionLegalHold`.
 *
 * Usage:
 *   pnpm exec tsx packages/db/scripts/retention-apply.ts
 *
 * A scheduled trigger exists on the client-dashboard cron route:
 *   GET /api/cron/retention  (Authorization: Bearer $CRON_SECRET)
 */

import { prisma } from '../src/client';
import { runRetentionBatch } from '../src/lib/retention-runner';

async function main(): Promise<void> {
  const summary = await runRetentionBatch();
  console.log(
    JSON.stringify(
      {
        generatedAt: summary.generatedAt,
        totals: summary.totals,
        organizations: summary.organizations,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : 'Retention apply failed.'
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
