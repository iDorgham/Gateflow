import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { withApiGuards, isGuardError } from '@/lib/api-guards';

export const dynamic = 'force-dynamic';

/** POST /api/danger/export — generate a full workspace data export */
export async function POST(request: NextRequest) {
  const guarded = await withApiGuards(request, {
    permission: 'workspace:manage',
    rateLimit: { key: 'danger:export', limit: 10, windowMs: 60_000 },
  });
  if (isGuardError(guarded)) return guarded;

  const { claims, orgId } = guarded;

  const [
    org,
    users,
    gates,
    projects,
    qrCodes,
    scanLogs,
    webhooks,
    apiKeys,
    contacts,
    units,
  ] = await Promise.all([
    prisma.organization.findFirst({ where: { id: orgId, deletedAt: null } }),
    prisma.user.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.gate.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: {
        id: true,
        name: true,
        location: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, name: true, description: true, createdAt: true },
    }),
    prisma.qRCode.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        code: true,
        type: true,
        maxUses: true,
        expiresAt: true,
        createdAt: true,
      },
      take: 10000,
    }),
    prisma.scanLog.findMany({
      where: { gate: { organizationId: orgId } },
      select: { id: true, status: true, scannedAt: true, gateId: true },
      take: 50000,
      orderBy: { scannedAt: 'desc' },
    }),
    prisma.webhook.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, url: true, events: true, isActive: true },
    }),
    prisma.apiKey.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        createdAt: true,
      },
    }),
    prisma.contact.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.unit.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, name: true, type: true, building: true },
    }),
  ]);

  if (!org) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    organization: {
      id: org.id,
      name: org.name,
      email: org.email,
      plan: org.plan,
      createdAt: org.createdAt,
    },
    summary: {
      users: users.length,
      gates: gates.length,
      projects: projects.length,
      qrCodes: qrCodes.length,
      scanLogs: scanLogs.length,
      contacts: contacts.length,
      units: units.length,
    },
    users,
    gates,
    projects,
    qrCodes,
    scanLogs,
    webhooks,
    apiKeys,
    contacts,
    units,
  };

  await prisma.auditLog.create({
    data: {
      action: 'WORKSPACE_EXPORT',
      entityType: 'Organization',
      entityId: orgId,
      organizationId: orgId,
      userId: claims.sub,
      metadata: { rowCount: scanLogs.length + qrCodes.length },
    },
  });

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="gateflow-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}
