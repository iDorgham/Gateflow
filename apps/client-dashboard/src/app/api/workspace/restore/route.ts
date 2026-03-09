import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma, type Prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const ManifestSchema = z.object({
  version: z.number(),
  organizationId: z.string(),
  scope: z.enum(['organization', 'project']).optional(),
  projectIds: z.array(z.string()).optional(),
  dateFrom: z.string().nullable().optional(),
  dateTo: z.string().nullable().optional(),
});

const RestoreBodySchema = z.object({
  manifest: ManifestSchema,
  organization: z.any().optional(),
  projects: z.array(z.any()).optional().default([]),
  gates: z.array(z.any()).optional().default([]),
  units: z.array(z.any()).optional().default([]),
  contacts: z.array(z.any()).optional().default([]),
  contactUnits: z.array(z.any()).optional().default([]),
  qrCodes: z.array(z.any()).optional().default([]),
  scanLogs: z.array(z.any()).optional().default([]),
  roles: z.array(z.any()).optional().default([]),
  tags: z.array(z.any()).optional().default([]),
  residentLimits: z.array(z.any()).optional().default([]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(claims, 'workspace:manage')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const orgId = claims.orgId;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = RestoreBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid backup payload', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      manifest,
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
    } = parsed.data;

    if (manifest.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, message: 'Backup belongs to a different organization' },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findFirst({
      where: { id: orgId, deletedAt: null },
      select: { id: true },
    });
    if (!org) {
      return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      let createdProjects = 0;
      let createdGates = 0;
      let createdUnits = 0;
      let createdContacts = 0;
      let createdContactUnits = 0;
      let createdQrCodes = 0;
      let createdScanLogs = 0;
      let createdRoles = 0;
      let createdTags = 0;
      let createdResidentLimits = 0;

      if (roles.length > 0) {
        const res = await tx.role.createMany({
          data: roles as Prisma.RoleCreateManyInput[],
          skipDuplicates: true,
        });
        createdRoles = res.count;
      }

      if (tags.length > 0) {
        const res = await tx.tag.createMany({
          data: tags as Prisma.TagCreateManyInput[],
          skipDuplicates: true,
        });
        createdTags = res.count;
      }

      if (residentLimits.length > 0) {
        const res = await tx.residentLimit.createMany({
          data: residentLimits as Prisma.ResidentLimitCreateManyInput[],
          skipDuplicates: true,
        });
        createdResidentLimits = res.count;
      }

      if (projects.length > 0) {
        const res = await tx.project.createMany({
          data: projects as Prisma.ProjectCreateManyInput[],
          skipDuplicates: true,
        });
        createdProjects = res.count;
      }

      if (gates.length > 0) {
        const res = await tx.gate.createMany({
          data: gates as Prisma.GateCreateManyInput[],
          skipDuplicates: true,
        });
        createdGates = res.count;
      }

      if (units.length > 0) {
        const res = await tx.unit.createMany({
          data: units as Prisma.UnitCreateManyInput[],
          skipDuplicates: true,
        });
        createdUnits = res.count;
      }

      if (contacts.length > 0) {
        const res = await tx.contact.createMany({
          data: contacts as Prisma.ContactCreateManyInput[],
          skipDuplicates: true,
        });
        createdContacts = res.count;
      }

      if (contactUnits.length > 0) {
        const res = await tx.contactUnit.createMany({
          data: contactUnits as Prisma.ContactUnitCreateManyInput[],
          skipDuplicates: true,
        });
        createdContactUnits = res.count;
      }

      if (qrCodes.length > 0) {
        const res = await tx.qRCode.createMany({
          data: qrCodes as Prisma.QRCodeCreateManyInput[],
          skipDuplicates: true,
        });
        createdQrCodes = res.count;
      }

      if (scanLogs.length > 0) {
        const res = await tx.scanLog.createMany({
          data: scanLogs as Prisma.ScanLogCreateManyInput[],
          skipDuplicates: true,
        });
        createdScanLogs = res.count;
      }

      return {
        createdProjects,
        createdGates,
        createdUnits,
        createdContacts,
        createdContactUnits,
        createdQrCodes,
        createdScanLogs,
        createdRoles,
        createdTags,
        createdResidentLimits,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Backup restored (merged) successfully',
      data: result,
    });
  } catch (error) {
    console.error('POST /api/workspace/restore error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

