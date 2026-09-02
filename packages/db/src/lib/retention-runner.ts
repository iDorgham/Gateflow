/**
 * retention-runner.ts — per-organization nightly PII purge + anonymization.
 *
 * Applies the org-scoped retention windows (retention-policy.ts) by:
 *   - hard-deleting expired operational records (scan logs, incidents,
 *     ID-artifact attachments),
 *   - anonymizing personal-data rows we keep for integrity (contacts and their
 *     vehicle-plate owner fields),
 * while respecting `retentionLegalHold`.
 *
 * Reused by both the standalone CLI (`scripts/retention-apply.ts`) and the
 * client-dashboard cron route (`/api/cron/retention`).
 */
import { prisma } from '../client';
import {
  buildRetentionCutoffs,
  type RetentionPolicy,
} from './retention-policy';
import {
  anonymizeContactPii,
  anonymizeVehiclePlatePii,
  retentionBatchEnabled,
} from './retention-apply';

export type OrgRetentionRecord = RetentionPolicy & {
  id: string;
};

export interface OrgRetentionSummary {
  organizationId: string;
  enabled: boolean;
  reason: string;
  deleted: { scanLogs: number; incidents: number; idArtifacts: number };
  anonymized: { contacts: number; vehiclePlates: number; users: number };
}

export interface RetentionBatchSummary {
  generatedAt: string;
  organizations: OrgRetentionSummary[];
  totals: {
    deleted: number;
    anonymized: number;
  };
}

/** One org's applicable paginated PII/operational sets. */
async function purgeOrg(
  org: OrgRetentionRecord,
  now: Date
): Promise<OrgRetentionSummary> {
  const cutoffs = buildRetentionCutoffs(org, now);
  const summary: OrgRetentionSummary = {
    organizationId: org.id,
    enabled: false,
    reason: 'no retention window configured',
    deleted: { scanLogs: 0, incidents: 0, idArtifacts: 0 },
    anonymized: { contacts: 0, vehiclePlates: 0, users: 0 },
  };

  if (org.retentionLegalHold) {
    summary.reason = 'legal hold';
    return summary;
  }
  if (!retentionBatchEnabled(cutoffs)) {
    return summary;
  }
  if (cutoffs.visitorHistory) {
    const secret = process.env.RETENTION_REDACTION_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error(
        'RETENTION_REDACTION_SECRET must be at least 32 characters'
      );
    }
  }
  summary.enabled = true;
  summary.reason = 'applied';

  // ── Hard purge: operational records past their window ─────────────────────
  if (cutoffs.scanLogs) {
    const res = await prisma.scanLog.deleteMany({
      where: {
        gate: { organizationId: org.id },
        scannedAt: { lt: cutoffs.scanLogs },
        deletedAt: null,
      },
    });
    summary.deleted.scanLogs = res.count;
  }
  if (cutoffs.incidents) {
    const res = await prisma.incident.deleteMany({
      where: {
        organizationId: org.id,
        createdAt: { lt: cutoffs.incidents },
        deletedAt: null,
      },
    });
    summary.deleted.incidents = res.count;
  }
  if (cutoffs.idArtifacts) {
    const res = await prisma.scanAttachment.deleteMany({
      where: {
        organizationId: org.id,
        createdAt: { lt: cutoffs.idArtifacts },
        type: { in: ['id_front', 'id_back', 'id_document'] },
      },
    });
    summary.deleted.idArtifacts = res.count;
  }

  // ── Anonymize: contacts + their vehicles past the visitor-history window ──
  if (cutoffs.visitorHistory) {
    const salt = org.id;
    while (true) {
      const staleContacts = await prisma.contact.findMany({
        where: {
          organizationId: org.id,
          updatedAt: { lt: cutoffs.visitorHistory },
        },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          company: true,
          jobTitle: true,
          companyWebsite: true,
          notes: true,
        },
        take: 2000,
      });
      if (staleContacts.length === 0) break;

      for (const contact of staleContacts) {
        const scrubbed = anonymizeContactPii(contact, salt);
        const updated = await prisma.contact.updateMany({
          where: {
            id: contact.id,
            organizationId: org.id,
            updatedAt: { lt: cutoffs.visitorHistory },
          },
          data: {
            firstName: scrubbed.firstName,
            lastName: scrubbed.lastName,
            email: scrubbed.email,
            phone: scrubbed.phone,
            company: scrubbed.company,
            jobTitle: scrubbed.jobTitle,
            companyWebsite: scrubbed.companyWebsite,
            notes: scrubbed.notes,
            updatedAt: now,
          },
        });
        if (updated.count !== 1) continue;
        summary.anonymized.contacts += 1;

        const plates = await prisma.vehiclePlate.findMany({
          where: { organizationId: org.id, contactId: contact.id },
          select: {
            id: true,
            plateNumber: true,
            ownerName: true,
            ownerPhone: true,
          },
        });
        for (const plate of plates) {
          const scrubbedPlate = anonymizeVehiclePlatePii(plate, salt);
          await prisma.vehiclePlate.update({
            where: { id: plate.id },
            data: {
              ownerName: scrubbedPlate.ownerName,
              ownerPhone: scrubbedPlate.ownerPhone,
            },
          });
          summary.anonymized.vehiclePlates += 1;
        }
      }
    }
  }

  return summary;
}

function total(summary: OrgRetentionSummary): number {
  return (
    summary.deleted.scanLogs +
    summary.deleted.incidents +
    summary.deleted.idArtifacts +
    summary.anonymized.contacts +
    summary.anonymized.vehiclePlates +
    summary.anonymized.users
  );
}

/** Run the nightly batch across every active organization. */
export async function runRetentionBatch(
  now: Date = new Date()
): Promise<RetentionBatchSummary> {
  const orgs = await prisma.organization.findMany({
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

  const summaries: OrgRetentionSummary[] = [];
  for (const org of orgs) {
    summaries.push(await purgeOrg(org as OrgRetentionRecord, now));
  }

  return {
    generatedAt: now.toISOString(),
    organizations: summaries,
    totals: {
      deleted: summaries.reduce(
        (s, o) =>
          s +
          (o.deleted.scanLogs + o.deleted.incidents + o.deleted.idArtifacts),
        0
      ),
      anonymized: summaries.reduce(
        (s, o) =>
          s +
          (o.anonymized.contacts +
            o.anonymized.vehiclePlates +
            o.anonymized.users),
        0
      ),
    },
  };
}

export { total as _retentionUnitTotal };
