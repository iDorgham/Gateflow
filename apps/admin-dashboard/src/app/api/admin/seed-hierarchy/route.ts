/**
 * ## POST /api/admin/seed-hierarchy
 *
 * **Auth:** Admin Session Cookie — **Internal Admin** only.
 *
 * **Rate limit:** 10 requests per hour.
 *
 * **Body (JSON):**
 * - `organizationId` (string, required)
 * - `projectId` (string, required)
 * - `ranges`: `UnitHierarchyRangeConfig`
 * - `seed` (int)
 * - `ownerContactIds`: `string[]` (round-robin assignment)
 * - `unitIdFormatOverride`: `UnitIdFormatKey`
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  prisma,
  seedUnitHierarchyForProject,
  AiActionStatus,
  type PrismaClient,
} from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const SeedHierarchyBodySchema = z.object({
  organizationId: z.string().min(1),
  projectId: z.string().min(1),
  ranges: z.object({
    minPhases: z.number().int().min(1).max(32),
    maxPhases: z.number().int().min(1).max(32),
    minBuildingsPerPhase: z.number().int().min(1).max(32),
    maxBuildingsPerPhase: z.number().int().min(1).max(32),
    minFloorsPerBuilding: z.number().int().min(1).max(32),
    maxFloorsPerBuilding: z.number().int().min(1).max(32),
    minUnitsPerFloor: z.number().int().min(1).max(32),
    maxUnitsPerFloor: z.number().int().min(1).max(40),
  }),
  seed: z.number().int().optional(),
  ownerContactIds: z.array(z.string()).min(1).optional(),
  unitIdFormatOverride: z
    .enum([
      'COMPACT',
      'BUILDING_FIRST',
      'SIMPLE',
      'LOCATION',
      'DESCRIPTIVE',
      'GLOBAL',
    ])
    .optional(),
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

  const parsed = SeedHierarchyBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // skip-organization-check (Admin Management)
  const org = await prisma.organization.findFirst({
    where: { id: data.organizationId, deletedAt: null },
    select: { id: true },
  });
  if (!org) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }

  const auditBase = {
    organizationId: data.organizationId,
    userId: actorId,
    actionType: 'SEED_HIERARCHY',
    prompt: 'GateFlow structural hierarchy seeding via Admin Dashboard',
    intentJson: {
      projectId: data.projectId,
      ranges: data.ranges,
      unitIdFormat: data.unitIdFormatOverride,
    } as const,
  };

  try {
    const result = await seedUnitHierarchyForProject(
      prisma as unknown as PrismaClient,
      {
        organizationId: data.organizationId,
        projectId: data.projectId,
        ranges: data.ranges,
        seed: data.seed ?? Math.floor(Math.random() * 1_000_000),
        ownerContactIds: data.ownerContactIds ?? [],
        unitIdFormatOverride: data.unitIdFormatOverride as any,
      }
    );

    // skip-organization-check (Admin Audit Log)
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.EXECUTED,
        result: 'seeding_completed',
        metadata: {
          scanned: result.planned.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // skip-organization-check (Admin Audit Log)
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.FAILED,
        result: 'seeding_failed',
        metadata: {
          message: message.length > 500 ? `${message.slice(0, 500)}…` : message,
        },
      },
    });
    console.error('[seed-hierarchy]', err);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
