/**
 * ## POST /api/admin/reset-tenant
 *
 * **Auth:** Admin Session Cookie — **Internal Admin** only.
 *
 * **Purpose:** Soft-delete ALL transactional and relational data for a given tenant/project
 * to allow for a clean re-seed/emulation run.
 *
 * **Body (JSON):**
 * - `organizationId` (string, required)
 * - `projectId` (string, optional) — if provided, only wipes data for this project.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, AiActionStatus } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const ResetTenantBodySchema = z.object({
  organizationId: z.string().min(1),
  projectId: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const actorId = 'system-admin';

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ResetTenantBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { organizationId, projectId } = parsed.data;

  // skip-organization-check (Admin Management)
  const auditBase = {
    organizationId,
    userId: actorId,
    actionType: 'RESET_TENANT',
    prompt: `GateFlow tenant reset requested for org: ${organizationId}`,
    intentJson: { projectId } as const,
  };

  try {
    const deletedAt = new Date();

    // Cascading soft-delete (V4 mandate)
    // We target high-volume relational tables first
    const projectFilter = projectId ? { projectId } : {};

    const stats = await prisma.$transaction([
      prisma.scanLog.deleteMany({
        where: {
          gate: { organizationId, ...projectFilter },
        },
      }),
      prisma.qrCode.updateMany({
        where: { organizationId, ...projectFilter, deletedAt: null },
        data: { deletedAt },
      }),
      prisma.unit.updateMany({
        where: { organizationId, ...projectFilter, deletedAt: null },
        data: { deletedAt },
      }),
      prisma.contact.updateMany({
        where: { organizationId, deletedAt: null },
        data: { deletedAt },
      }),
      prisma.incident.updateMany({
        where: { organizationId, deletedAt: null },
        data: { deletedAt },
      }),
    ]);

    // skip-organization-check (Admin Audit Log)
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.EXECUTED,
        result: 'wash_and_reset_ok',
        metadata: {
          stats: {
            scansRemoved: stats[0].count,
            qrCodesSoftDeleted: stats[1].count,
            unitsSoftDeleted: stats[2].count,
            contactsSoftDeleted: stats[3].count,
            incidentsSoftDeleted: stats[4].count,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tenant data soft-deleted successfully.',
      count: stats.reduce(
        (acc: number, s: { count: number }) => acc + s.count,
        0
      ),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // skip-organization-check (Admin Audit Log)
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.FAILED,
        result: 'reset_failed',
        metadata: { message },
      },
    });
    console.error('[reset-tenant]', err);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
