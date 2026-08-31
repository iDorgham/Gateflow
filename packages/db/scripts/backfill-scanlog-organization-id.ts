import { prisma } from '../src';

/**
 * Backfill script for Task 0.2 [P0-002 Fix]:
 * Populates ScanLog.organizationId from linked Gate or QRCode for any legacy ScanLog rows.
 */
export async function backfillScanLogOrganizationId(): Promise<{
  updatedCount: number;
  remainingNulls: number;
}> {
  console.log('[backfill] Starting ScanLog.organizationId backfill...');

  // Find all ScanLog entries with null organizationId
  const unlinkedScanLogs = await prisma.scanLog.findMany({
    where: { organizationId: null },
    select: {
      id: true,
      gate: { select: { organizationId: true } },
      qrCode: { select: { organizationId: true } },
    },
    take: 5000,
  });

  if (unlinkedScanLogs.length === 0) {
    console.log(
      '[backfill] No ScanLog records with null organizationId found.'
    );
    return { updatedCount: 0, remainingNulls: 0 };
  }

  console.log(
    `[backfill] Found ${unlinkedScanLogs.length} ScanLog records to backfill.`
  );

  let updatedCount = 0;
  for (const scan of unlinkedScanLogs) {
    const orgId = scan.gate?.organizationId ?? scan.qrCode?.organizationId;
    if (orgId) {
      await prisma.scanLog.update({
        where: { id: scan.id },
        data: { organizationId: orgId },
      });
      updatedCount++;
    }
  }

  const remainingNulls = await prisma.scanLog.count({
    where: { organizationId: null },
  });

  console.log(
    `[backfill] Successfully updated ${updatedCount} ScanLog records. Remaining nulls: ${remainingNulls}`
  );

  return { updatedCount, remainingNulls };
}

if (require.main === module) {
  backfillScanLogOrganizationId()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[backfill] Error during backfill:', err);
      process.exit(1);
    });
}
