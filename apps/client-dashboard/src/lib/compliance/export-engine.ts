/**
 * Compliance export engine for Law 151 / PDPL.
 *
 * Collects personal-data + processing evidence within a tenant, runs the
 * regime assessment, and renders a CSV + PDF report. Mirrors the analytics
 * export-pdf pdfkit pattern. The data shaping (buildRows, computeEvidence,
 * renderCsv) is dependency-light and unit-testable; pdflib is isolated to the
 * buffer producer.
 */
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { prisma } from '@gate-access/db';
import {
  assessCompliance,
  getRegime,
  type ComplianceEvidence,
  type ComplianceRegime,
} from './regimes';

export type { ComplianceRegime } from './regimes';

// ─── Data shapes ───────────────────────────────────────────────────────────────

export interface ContactPiiRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

export interface ProcessingEventRow {
  id: string;
  scannedAt: string;
  status: string;
  gateId: string | null;
}

export interface AuditEventRow {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
}

export interface ComplianceExportData {
  regime: ComplianceRegime;
  orgName: string;
  generatedAt: string;
  window: { from: string; to: string };
  evidence: ComplianceEvidence;
  contacts: ContactPiiRow[];
  processingEvents: ProcessingEventRow[];
  auditEvents: AuditEventRow[];
}

// ─── Pure shaping helpers (unit-testable) ─────────────────────────────────────

export interface CollectedRows {
  contacts: ContactPiiRow[];
  processingEvents: ProcessingEventRow[];
  auditEvents: AuditEventRow[];
}

export interface VerifiedTenantComplianceSettings {
  hasDataProtectionOfficer: boolean;
  breachNotificationConfigured: boolean;
  auditLoggingVerified: boolean;
  statutoryRightsWorkflowsVerified: boolean;
  retentionAgingVerified: boolean;
}

/**
 * Extract and validate compliance verification settings from tenant scanner configuration.
 * Parses the `compliance` object from scannerConfig and verifies that all required
 * boolean fields and a verification timestamp are present.
 *
 * @param scannerConfig - The raw tenant scanner configuration object.
 * @returns The verified compliance settings, or null if invalid or unverified.
 */
export function parseVerifiedTenantComplianceSettings(
  scannerConfig: unknown
): VerifiedTenantComplianceSettings | null {
  if (!scannerConfig || typeof scannerConfig !== 'object') return null;
  const compliance = (scannerConfig as Record<string, unknown>).compliance;
  if (!compliance || typeof compliance !== 'object') return null;
  const settings = compliance as Record<string, unknown>;
  if (
    typeof settings.verifiedAt !== 'string' ||
    Number.isNaN(Date.parse(settings.verifiedAt))
  ) {
    return null;
  }

  const keys = [
    'hasDataProtectionOfficer',
    'breachNotificationConfigured',
    'auditLoggingVerified',
    'statutoryRightsWorkflowsVerified',
    'retentionAgingVerified',
  ] as const;
  if (keys.some((key) => typeof settings[key] !== 'boolean')) return null;

  return Object.fromEntries(
    keys.map((key) => [key, settings[key]])
  ) as unknown as VerifiedTenantComplianceSettings;
}

/**
 * Build compliance evidence from collected data rows and verification settings.
 * Aggregates record counts and merges verified compliance settings into a
 * single evidence object for regime assessment.
 *
 * @param rows - The collected contact, processing, and audit data rows.
 * @param settings - Optional verified compliance settings from tenant configuration.
 * @returns A compliance evidence object suitable for regime assessment.
 */
export function buildEvidence(
  rows: CollectedRows,
  settings: VerifiedTenantComplianceSettings | null = null
): ComplianceEvidence {
  return {
    piiRecordCount: rows.contacts.length,
    processingEventCount: rows.processingEvents.length,
    auditLogCount: rows.auditEvents.length,
    hasDataProtectionOfficer: settings?.hasDataProtectionOfficer ?? null,
    breachNotificationConfigured:
      settings?.breachNotificationConfigured ?? null,
    auditLoggingVerified: settings?.auditLoggingVerified ?? null,
    statutoryRightsWorkflowsVerified:
      settings?.statutoryRightsWorkflowsVerified ?? null,
    retentionAgingVerified: settings?.retentionAgingVerified ?? null,
  };
}

/**
 * Render compliance data rows as a CSV string for export.
 * Combines contacts, processing events, and audit events into a single CSV
 * with a 'recordType' discriminator column.
 *
 * @param rows - The collected contact, processing, and audit data rows.
 * @returns A CSV string with headers and all data rows.
 */
export function renderCsv(rows: CollectedRows): string {
  const fields = [
    'recordType',
    'id',
    'fullName',
    'email',
    'phone',
    'company',
    'createdAt',
    'scannedAt',
    'status',
    'gateId',
    'action',
    'entityType',
  ];
  const records = [
    ...rows.contacts.map((row) => ({ recordType: 'contact', ...row })),
    ...rows.processingEvents.map((row) => ({
      recordType: 'processing_event',
      ...row,
    })),
    ...rows.auditEvents.map((row) => ({ recordType: 'audit_event', ...row })),
  ];

  return new Parser({ fields }).parse(records);
}

// ─── Prisma-backed collection ─────────────────────────────────────────────────

/**
 * Collect compliance-relevant data from the database for a specific organization and date range.
 * Fetches contacts (up to 1000), scan logs (up to 5000), and audit logs (up to 5000)
 * for the given tenant and time window.
 *
 * @param orgId - The organization ID to collect data for.
 * @param dateFrom - The start of the collection window.
 * @param dateTo - The end of the collection window.
 * @returns A CollectedRows object containing all relevant data rows.
 */
export async function collectComplianceRows(
  orgId: string,
  dateFrom: Date,
  dateTo: Date
): Promise<CollectedRows> {
  const [contacts, processingEvents, auditEvents] = await Promise.all([
    prisma.contact.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 1000,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        createdAt: true,
      },
    }),
    prisma.scanLog.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        scannedAt: { gte: dateFrom, lte: dateTo },
      },
      orderBy: { scannedAt: 'asc' },
      take: 5000,
      select: { id: true, scannedAt: true, status: true, gateId: true },
    }),
    prisma.auditLog.findMany({
      where: {
        organizationId: orgId,
        createdAt: { gte: dateFrom, lte: dateTo },
      },
      orderBy: { createdAt: 'asc' },
      take: 5000,
      select: { id: true, action: true, entityType: true, createdAt: true },
    }),
  ]);

  return {
    contacts: contacts.map((c) => ({
      id: c.id,
      fullName: `${c.firstName} ${c.lastName ?? ''}`.trim(),
      email: c.email ?? '',
      phone: c.phone ?? '',
      company: c.company ?? '',
      createdAt: c.createdAt.toISOString(),
    })),
    processingEvents: processingEvents.map((p) => ({
      id: p.id,
      scannedAt: p.scannedAt.toISOString(),
      status: p.status,
      gateId: p.gateId,
    })),
    auditEvents: auditEvents.map((a) => ({
      id: a.id,
      action: a.action,
      entityType: a.entityType,
      createdAt: a.createdAt.toISOString(),
    })),
  };
}

// ─── Buffer producers (pdfkit is only exercised here) ─────────────────────────

/**
 * Generate a compliance report PDF from export data.
 * Renders a structured PDF document containing the regime assessment, control
 * statuses, and evidence summary using pdfkit.
 *
 * @param data - The complete compliance export data including regime, evidence, and records.
 * @returns A Promise that resolves to a Buffer containing the PDF document.
 */
export function renderPdf(data: ComplianceExportData): Promise<Buffer> {
  const regime = getRegime(data.regime);
  const assessment = assessCompliance(data.regime, data.evidence);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    doc
      .fontSize(16)
      .fillColor('#000000')
      .text('Data Protection Compliance Report');
    doc.moveDown(0.4);
    doc.fontSize(9).fillColor('#555555');
    doc.text(`Regime: ${regime.name}`);
    doc.text(`Jurisdiction: ${regime.jurisdiction}`);
    doc.text(`Organization: ${data.orgName}`);
    doc.text(`Window: ${data.window.from} → ${data.window.to}`);
    doc.text(`Generated at: ${data.generatedAt}`);
    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor('#000000')
      .text('Compliance posture', { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(9);
    doc.text(
      `Overall status: ${assessment.status} (score ${assessment.score}%)`
    );

    assessment.controls.forEach((c) => {
      if (c.status === 'INFO') return;
      doc.text(`[${c.status}] ${c.title} — ${c.note}`);
    });
    doc.moveDown(0.6);

    doc.fontSize(9).fillColor('#333333');
    doc.text('Controller notice:');
    doc.fillColor('#555555').text(`${regime.controllerNotice}`, { width: 500 });

    doc.moveDown(0.6);
    doc.fontSize(9).fillColor('#555555');
    doc.text(
      `Respects ${data.evidence.piiRecordCount} personal-data records and tracks ${data.evidence.processingEventCount} processing events and ${data.evidence.auditLogCount} audit entries.`
    );
    doc.moveDown(0.6);

    doc.fontSize(8).fillColor('#777777');
    doc.text(
      'This report is a compliance inventory and posture summary; it is not legal advice.'
    );

    doc.end();
  });
}
