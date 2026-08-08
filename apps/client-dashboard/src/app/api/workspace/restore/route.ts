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

/**
 * Every record in the backup payload is client-supplied JSON — organizationId
 * and cross-entity foreign keys (projectId, gateId, qrCodeId, contactId,
 * unitId) must never be trusted as-is, or a crafted payload could inject rows
 * into, or link against, another tenant's data. Resolve referenced ids
 * against a set scoped to the caller's own org before using them.
 */
async function scopedIdSet(
  ids: string[],
  finder: (ids: string[]) => Promise<Array<{ id: string }>>
): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const rows = await finder(ids);
  return new Set(rows.map((r) => r.id));
}

function uniqueIds(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((id): id is string => !!id)));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!hasPermission(claims, 'workspace:manage')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const orgId = claims.orgId;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = RestoreBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid backup payload',
          error: parsed.error.flatten(),
        },
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
        {
          success: false,
          message: 'Backup belongs to a different organization',
        },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findFirst({
      where: { id: orgId, deletedAt: null },
      select: { id: true },
    });
    if (!org) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
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

      // Every entity below forces organizationId to the authenticated caller's
      // org, ignoring whatever the client-supplied backup record claims.

      if (roles.length > 0) {
        const data = (roles as Prisma.RoleCreateManyInput[]).map((r) => ({
          ...r,
          organizationId: orgId,
        }));
        const res = await tx.role.createMany({ data, skipDuplicates: true });
        createdRoles = res.count;
      }

      if (tags.length > 0) {
        const data = (tags as Prisma.TagCreateManyInput[]).map((t) => ({
          ...t,
          organizationId: orgId,
        }));
        const res = await tx.tag.createMany({ data, skipDuplicates: true });
        createdTags = res.count;
      }

      if (residentLimits.length > 0) {
        const data = (
          residentLimits as Prisma.ResidentLimitCreateManyInput[]
        ).map((r) => ({
          ...r,
          organizationId: orgId,
        }));
        const res = await tx.residentLimit.createMany({
          data,
          skipDuplicates: true,
        });
        createdResidentLimits = res.count;
      }

      if (projects.length > 0) {
        const data = (projects as Prisma.ProjectCreateManyInput[]).map((p) => ({
          ...p,
          organizationId: orgId,
        }));
        const res = await tx.project.createMany({ data, skipDuplicates: true });
        createdProjects = res.count;
      }

      if (gates.length > 0) {
        const rawGates = gates as Prisma.GateCreateManyInput[];
        const validProjectIds = await scopedIdSet(
          uniqueIds(rawGates.map((g) => g.projectId)),
          (ids) =>
            tx.project.findMany({
              where: { id: { in: ids }, organizationId: orgId },
              select: { id: true },
            })
        );
        const data = rawGates.map((g) => ({
          ...g,
          organizationId: orgId,
          projectId:
            g.projectId && validProjectIds.has(g.projectId)
              ? g.projectId
              : null,
        }));
        const res = await tx.gate.createMany({ data, skipDuplicates: true });
        createdGates = res.count;
      }

      if (units.length > 0) {
        const rawUnits = units as Prisma.UnitCreateManyInput[];
        const validProjectIds = await scopedIdSet(
          uniqueIds(rawUnits.map((u) => u.projectId)),
          (ids) =>
            tx.project.findMany({
              where: { id: { in: ids }, organizationId: orgId },
              select: { id: true },
            })
        );
        const data = rawUnits.map((u) => ({
          ...u,
          organizationId: orgId,
          projectId:
            u.projectId && validProjectIds.has(u.projectId)
              ? u.projectId
              : null,
          // A resident-linked unit must not be attached to another org's user.
          userId: undefined,
        }));
        const res = await tx.unit.createMany({ data, skipDuplicates: true });
        createdUnits = res.count;
      }

      if (contacts.length > 0) {
        const data = (contacts as Prisma.ContactCreateManyInput[]).map((c) => ({
          ...c,
          organizationId: orgId,
        }));
        const res = await tx.contact.createMany({ data, skipDuplicates: true });
        createdContacts = res.count;
      }

      if (contactUnits.length > 0) {
        const rawContactUnits =
          contactUnits as Prisma.ContactUnitCreateManyInput[];
        const [validContactIds, validUnitIds] = await Promise.all([
          scopedIdSet(
            uniqueIds(rawContactUnits.map((cu) => cu.contactId)),
            (ids) =>
              tx.contact.findMany({
                where: { id: { in: ids }, organizationId: orgId },
                select: { id: true },
              })
          ),
          scopedIdSet(
            uniqueIds(rawContactUnits.map((cu) => cu.unitId)),
            (ids) =>
              tx.unit.findMany({
                where: { id: { in: ids }, organizationId: orgId },
                select: { id: true },
              })
          ),
        ]);
        const data = rawContactUnits.filter(
          (cu) =>
            validContactIds.has(cu.contactId) && validUnitIds.has(cu.unitId)
        );
        if (data.length > 0) {
          const res = await tx.contactUnit.createMany({
            data,
            skipDuplicates: true,
          });
          createdContactUnits = res.count;
        }
      }

      if (qrCodes.length > 0) {
        const rawQrCodes = qrCodes as Prisma.QRCodeCreateManyInput[];
        const [validGateIds, validProjectIds, validContactIds] =
          await Promise.all([
            scopedIdSet(uniqueIds(rawQrCodes.map((q) => q.gateId)), (ids) =>
              tx.gate.findMany({
                where: { id: { in: ids }, organizationId: orgId },
                select: { id: true },
              })
            ),
            scopedIdSet(uniqueIds(rawQrCodes.map((q) => q.projectId)), (ids) =>
              tx.project.findMany({
                where: { id: { in: ids }, organizationId: orgId },
                select: { id: true },
              })
            ),
            scopedIdSet(uniqueIds(rawQrCodes.map((q) => q.contactId)), (ids) =>
              tx.contact.findMany({
                where: { id: { in: ids }, organizationId: orgId },
                select: { id: true },
              })
            ),
          ]);
        const data = rawQrCodes.map((q) => ({
          ...q,
          organizationId: orgId,
          gateId: q.gateId && validGateIds.has(q.gateId) ? q.gateId : null,
          projectId:
            q.projectId && validProjectIds.has(q.projectId)
              ? q.projectId
              : null,
          contactId:
            q.contactId && validContactIds.has(q.contactId)
              ? q.contactId
              : null,
        }));
        const res = await tx.qRCode.createMany({ data, skipDuplicates: true });
        createdQrCodes = res.count;
      }

      if (scanLogs.length > 0) {
        const rawScanLogs = scanLogs as Prisma.ScanLogCreateManyInput[];
        const [validGateIds, validQrCodeIds] = await Promise.all([
          scopedIdSet(uniqueIds(rawScanLogs.map((s) => s.gateId)), (ids) =>
            tx.gate.findMany({
              where: { id: { in: ids }, organizationId: orgId },
              select: { id: true },
            })
          ),
          scopedIdSet(uniqueIds(rawScanLogs.map((s) => s.qrCodeId)), (ids) =>
            tx.qRCode.findMany({
              where: { id: { in: ids }, organizationId: orgId },
              select: { id: true },
            })
          ),
        ]);
        const data = rawScanLogs
          .filter(
            (s) => validGateIds.has(s.gateId) && validQrCodeIds.has(s.qrCodeId)
          )
          .map((s) => ({
            ...s,
            // Never attribute a restored scan to a user outside the caller's org.
            userId: undefined,
          }));
        if (data.length > 0) {
          const res = await tx.scanLog.createMany({
            data,
            skipDuplicates: true,
          });
          createdScanLogs = res.count;
        }
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
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
