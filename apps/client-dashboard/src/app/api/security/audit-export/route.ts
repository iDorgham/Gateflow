import { NextRequest, NextResponse } from 'next/server';
import { prisma, verifyAuditLedgerIntegrity } from '@gate-access/db';
import { withApiGuards, isGuardError } from '@/lib/api-guards';
import { logAuditAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/security/audit-export?format=json|csv
 * Generates an official, cryptographically sealed compliance export package
 * compliant with Egyptian Personal Data Protection Law No. 151 and Saudi PDPL.
 */
export async function GET(request: NextRequest) {
  const guarded = await withApiGuards(request, {
    permission: 'workspace:manage',
    rateLimit: { key: 'security:audit-export', limit: 10, windowMs: 60_000 },
  });
  if (isGuardError(guarded)) return guarded;

  const { claims, orgId } = guarded;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') === 'csv' ? 'csv' : 'json';

  try {
    // 1. Fetch organization details, audit logs, and users
    const [org, logs, users] = await Promise.all([
      prisma.organization.findFirst({
        where: { id: orgId, deletedAt: null },
        select: { id: true, name: true, domain: true, createdAt: true },
      }),
      prisma.auditLog.findMany({
        where: { organizationId: orgId },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
      prisma.user.findMany({
        where: { organizationId: orgId },
        select: { id: true, name: true, email: true, role: true },
      }),
    ]);

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    const userMap = new Map(users.map((u) => [u.id, u]));

    // 2. Compute ledger cryptographic verification seal
    const integrity = await verifyAuditLedgerIntegrity(prisma, orgId);

    // 3. Log the compliance export action in the audit trail
    await logAuditAction({
      action: 'COMPLIANCE_AUDIT_EXPORT',
      entityType: 'SECURITY',
      entityId: orgId,
      userId: claims.sub,
      orgId,
      metadata: {
        format,
        exportedCount: logs.length,
        ledgerValid: integrity.isValid,
        latestHash: integrity.latestHash,
      },
    });

    const exportTimestamp = new Date().toISOString();
    const fileSlug = (org.domain || org.name || org.id)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    if (format === 'csv') {
      const csvHeader = [
        'ID',
        'Timestamp (UTC)',
        'Action',
        'EntityType',
        'EntityId',
        'User Email',
        'User Role',
        'Sequence',
        'Previous Hash',
        'Entry Hash',
      ].join(',');

      const csvRows = logs.map((log) => {
        const meta = (log.metadata ?? {}) as Record<string, unknown>;
        const seq = meta.seq ?? '';
        const prevHash = meta.previousHash ?? '';
        const hash = meta.hash ?? '';
        const user = log.userId ? userMap.get(log.userId) : null;
        const userEmail = user?.email
          ? `"${user.email.replace(/"/g, '""')}"`
          : '';
        const userRole = user?.role ?? '';
        const action = `"${log.action.replace(/"/g, '""')}"`;
        const entityType = `"${log.entityType.replace(/"/g, '""')}"`;
        const entityId = log.entityId
          ? `"${log.entityId.replace(/"/g, '""')}"`
          : '';
        const createdAt = log.createdAt.toISOString();

        return [
          log.id,
          createdAt,
          action,
          entityType,
          entityId,
          userEmail,
          userRole,
          seq,
          prevHash,
          hash,
        ].join(',');
      });

      const csvContent = [
        `# GateFlow MENA Security Compliance Export — Egyptian Law 151 / Saudi PDPL`,
        `# Organization: ${org.name} (${org.id})`,
        `# Exported At: ${exportTimestamp}`,
        `# Ledger Integrity Verified: ${integrity.isValid}`,
        `# Latest Seal Hash: ${integrity.latestHash}`,
        csvHeader,
        ...csvRows,
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="gateflow-audit-${fileSlug}-${exportTimestamp.slice(0, 10)}.csv"`,
        },
      });
    }

    // JSON export
    const payload = {
      complianceStandard: 'EGYPT_LAW_151_SAUDI_PDPL_AUDIT_V1',
      exportedAt: exportTimestamp,
      organization: org,
      integritySeal: integrity,
      records: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        createdAt: log.createdAt.toISOString(),
        user: log.userId ? userMap.get(log.userId) : null,
        metadata: log.metadata,
      })),
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="gateflow-audit-${fileSlug}-${exportTimestamp.slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error('[AuditExport] Export failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate compliance audit export' },
      { status: 500 }
    );
  }
}
