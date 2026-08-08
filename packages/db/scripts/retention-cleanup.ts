/**
 * Privacy-safe retention planner.
 *
 * This command is deliberately dry-run only. It calculates per-organization cutoffs and
 * candidate counts without reading row content or deleting data. A future apply phase must
 * consume this evidence, preserve legal holds, define relationship order, and require an
 * independently reviewed confirmation mechanism.
 *
 * Usage: pnpm exec tsx packages/db/scripts/retention-cleanup.ts
 */

import { prisma } from '../src/client';
import { buildRetentionCutoffs } from '../src/lib/retention-policy';

type CandidateCounts = {
  scanLogs: number;
  visitorHistory: number;
  idArtifacts: number;
  incidents: number;
};

async function countCandidates(
  organizationId: string,
  cutoffs: ReturnType<typeof buildRetentionCutoffs>
): Promise<CandidateCounts> {
  const [scanLogs, visitorHistory, idArtifacts, incidents] = await Promise.all([
    cutoffs.scanLogs
      ? prisma.scanLog.count({
          where: {
            scannedAt: { lt: cutoffs.scanLogs },
            gate: { organizationId },
            deletedAt: null,
          },
        })
      : 0,
    cutoffs.visitorHistory
      ? prisma.visitorQR.count({
          where: {
            createdAt: { lt: cutoffs.visitorHistory },
            qrCode: { organizationId },
          },
        })
      : 0,
    cutoffs.idArtifacts
      ? prisma.scanAttachment.count({
          where: {
            organizationId,
            createdAt: { lt: cutoffs.idArtifacts },
            type: { in: ['id_front', 'id_back', 'id_document'] },
          },
        })
      : 0,
    cutoffs.incidents
      ? prisma.incident.count({
          where: {
            organizationId,
            createdAt: { lt: cutoffs.incidents },
            deletedAt: null,
          },
        })
      : 0,
  ]);
  return { scanLogs, visitorHistory, idArtifacts, incidents };
}

export async function main(): Promise<void> {
  if (process.argv.includes('--apply')) {
    throw new Error(
      'Retention apply is not implemented. Dry-run evidence and independent approval are required first.'
    );
  }

  const now = new Date();
  const organizations = await prisma.organization.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      scanLogRetentionMonths: true,
      visitorHistoryRetentionMonths: true,
      idArtifactRetentionMonths: true,
      incidentRetentionMonths: true,
      retentionLegalHold: true,
      retentionPolicyUpdatedAt: true,
    },
  });

  const results = [];
  for (const organization of organizations) {
    const cutoffs = buildRetentionCutoffs(organization, now);
    results.push({
      organizationId: organization.id,
      mode: 'dry-run',
      legalHold: organization.retentionLegalHold,
      policyUpdatedAt: organization.retentionPolicyUpdatedAt,
      cutoffs,
      candidates: await countCandidates(organization.id, cutoffs),
    });
  }

  console.log(
    JSON.stringify(
      {
        generatedAt: now.toISOString(),
        mode: 'dry-run',
        organizations: results,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : 'Retention planning failed.'
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
