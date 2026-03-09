import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const ExportQuerySchema = z.object({
  scope: z.enum(['organization', 'project']).optional().default('organization'),
  projectId: z.string().optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(claims, 'workspace:manage')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const orgId = claims.orgId;

    const { searchParams } = new URL(request.url);
    const parsed = ExportQuerySchema.safeParse({
      scope: searchParams.get('scope') ?? undefined,
      projectId: searchParams.get('projectId') ?? undefined,
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid query params', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { scope, projectId, from, to } = parsed.data;

    if (scope === 'project' && !projectId) {
      return NextResponse.json(
        { success: false, message: 'projectId is required when scope=project' },
        { status: 400 }
      );
    }

    let projectFilter: { id?: string; organizationId: string; deletedAt: null } | null = null;
    if (scope === 'project' && projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!project) {
        return NextResponse.json({ success: false, message: 'Invalid project' }, { status: 400 });
      }
      projectFilter = { id: projectId, organizationId: orgId, deletedAt: null };
    }

    const fromDate = from ? new Date(from + 'T00:00:00.000Z') : null;
    const toDate = to ? new Date(to + 'T23:59:59.999Z') : null;

    // Organization (always single row)
    const organization = await prisma.organization.findFirst({
      where: { id: orgId, deletedAt: null },
    });
    if (!organization) {
      return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
    }

    // Projects
    const projects = await prisma.project.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectFilter ? { id: projectFilter.id } : {}),
      },
    });

    const projectIds = projects.map((p) => p.id);

    // Gates
    const gates = await prisma.gate.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectIds.length > 0 ? { projectId: { in: projectIds } } : {}),
      },
    });

    // Units
    const units = await prisma.unit.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectIds.length > 0 ? { projectId: { in: projectIds } } : {}),
      },
    });

    const unitIds = units.map((u) => u.id);

    // Contacts
    const contacts = await prisma.contact.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(unitIds.length > 0
          ? {
              units: {
                some: {
                  unitId: { in: unitIds },
                },
              },
            }
          : {}),
      },
    });

    const contactIds = contacts.map((c) => c.id);

    // Contact <-> Unit links
    const contactUnits = await prisma.contactUnit.findMany({
      where: {
        ...(contactIds.length > 0 ? { contactId: { in: contactIds } } : {}),
        ...(unitIds.length > 0 ? { unitId: { in: unitIds } } : {}),
      },
    });

    // QR codes
    const qrWhere: Parameters<typeof prisma.qRCode.findMany>[0]['where'] = {
      organizationId: orgId,
      deletedAt: null,
      ...(projectIds.length > 0 ? { projectId: { in: projectIds } } : {}),
    };

    if (fromDate || toDate) {
      qrWhere.createdAt = {
        ...(fromDate ? { gte: fromDate } : {}),
        ...(toDate ? { lte: toDate } : {}),
      };
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: qrWhere,
    });

    const qrIds = qrCodes.map((q) => q.id);

    // Scan logs (scoped via QR codes and date range)
    const scanWhere: Parameters<typeof prisma.scanLog.findMany>[0]['where'] = {
      ...(qrIds.length > 0 ? { qrCodeId: { in: qrIds } } : {}),
    };

    if (fromDate || toDate) {
      scanWhere.scannedAt = {
        ...(fromDate ? { gte: fromDate } : {}),
        ...(toDate ? { lte: toDate } : {}),
      };
    }

    const scanLogs = await prisma.scanLog.findMany({
      where: scanWhere,
    });

    // Supporting configuration models (roles, tags, resident limits) for completeness
    const roles = await prisma.role.findMany({
      where: { organizationId: orgId },
    });

    const tags = await prisma.tag.findMany({
      where: { organizationId: orgId, deletedAt: null },
    });

    const residentLimits = await prisma.residentLimit.findMany({
      where: { organizationId: orgId },
    });

    const manifest = {
      version: 1,
      createdAt: new Date().toISOString(),
      scope,
      organizationId: orgId,
      projectIds,
      dateFrom: fromDate?.toISOString() ?? null,
      dateTo: toDate?.toISOString() ?? null,
    };

    const payload = {
      manifest,
      organization,
      projects,
      gates,
      units,
      contacts,
      contactUnits,
      qrCodes,
      scanLogs,
      roles,
      tags,
      residentLimits,
    };

    const filenameScope = scope === 'project' && projectIds.length === 1 ? `project-${projectIds[0]}` : 'organization';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const res = NextResponse.json(payload, { status: 200 });
    res.headers.set(
      'Content-Disposition',
      `attachment; filename="gateflow-export-${filenameScope}-${timestamp}.json"`
    );
    return res;
  } catch (error) {
    console.error('GET /api/workspace/export error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

