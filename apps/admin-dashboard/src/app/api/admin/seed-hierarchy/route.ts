import { NextRequest, NextResponse } from 'next/server';
import {
  prisma,
  seedUnitHierarchyForProject,
  AiActionStatus,
  type PrismaClient,
} from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { z } from 'zod';

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
  unitIdFormat: z
    .enum([
      'COMPACT',
      'BUILDING_FIRST',
      'SIMPLE',
      'LOCATION',
      'DESCRIPTIVE',
      'GLOBAL',
    ])
    .optional(),
  randomSeed: z.number().int().optional(),
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

  const { organizationId, projectId, ranges, unitIdFormat, randomSeed } =
    parsed.data;
  const seed = randomSeed ?? Math.floor(Math.random() * 1_000_000);

  const auditBase = {
    organizationId,
    userId: actorId,
    actionType: 'SEED_HIERARCHY',
    prompt: `GateFlow organizational hierarchy seeding (Admin Dashboard)`,
    intentJson: { projectId, ranges, unitIdFormat, seed } as const,
  };

  try {
    // 1. Get some contacts to act as owners
    const contacts = await prisma.contact.findMany({
      where: { organizationId, deletedAt: null },
      take: 10,
      select: { id: true },
    });

    if (contacts.length === 0) {
      throw new Error(
        'seed-hierarchy: No contacts found in target organization'
      );
    }

    const result = await seedUnitHierarchyForProject(
      prisma as unknown as PrismaClient,
      {
        organizationId,
        projectId,
        ranges,
        seed,
        ownerContactIds: contacts.map((c: any) => c.id),
        unitIdFormatOverride: unitIdFormat as any,
      }
    );

    // skip-organization-check (Admin Audit Log)
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.EXECUTED,
        result: 'seeding_completed',
        metadata: {
          unitsCreated: result.unitsCreated,
          contactLinksCreated: result.contactLinksCreated,
          projectId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        unitsCreated: result.unitsCreated,
        contactLinksCreated: result.contactLinksCreated,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[seed-hierarchy] Failed for ${organizationId}:`, err);

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

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
