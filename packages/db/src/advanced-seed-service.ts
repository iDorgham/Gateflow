/**
 * Orchestration for advanced seeding phases (units, traffic, QR chain — incremental).
 */

import type { Prisma, PrismaClient, UnitIdFormat } from '@prisma/client';
import {
  buildPlannedUnitHierarchy,
  plannedUnitsToCreateManyInput,
  type PlannedUnitSeed,
  type UnitHierarchyRangeConfig,
} from './lib/unit-hierarchy-seed';
import { createUniquenessBucket } from './lib/seed-integrity';
import type { UniquenessBucket } from './lib/seed-integrity';

const CREATE_MANY_CHUNK = 500;

async function createManyInChunksUnit(
  run: (batch: Prisma.UnitCreateManyInput[]) => Promise<{ count?: number }>,
  rows: Prisma.UnitCreateManyInput[]
): Promise<number> {
  let total = 0;
  for (let i = 0; i < rows.length; i += CREATE_MANY_CHUNK) {
    const batch = rows.slice(i, i + CREATE_MANY_CHUNK);
    const res = await run(batch);
    total += res.count ?? batch.length;
  }
  return total;
}

async function createManyInChunksContactUnit(
  run: (
    batch: Prisma.ContactUnitCreateManyInput[]
  ) => Promise<{ count?: number }>,
  rows: Prisma.ContactUnitCreateManyInput[]
): Promise<number> {
  let total = 0;
  for (let i = 0; i < rows.length; i += CREATE_MANY_CHUNK) {
    const batch = rows.slice(i, i + CREATE_MANY_CHUNK);
    const res = await run(batch);
    total += res.count ?? batch.length;
  }
  return total;
}

export type SeedUnitHierarchyForProjectParams = {
  organizationId: string;
  projectId: string;
  ranges: UnitHierarchyRangeConfig;
  seed: number;
  ownerContactIds: string[];
  /** When set, reuses the same uniqueness bucket as contacts / other seed rows in the org. */
  nameBucket?: UniquenessBucket;
  /** Overrides `Project.unitIdFormat` from the database when set. */
  unitIdFormatOverride?: UnitIdFormat;
};

export type SeedUnitHierarchyForProjectResult = {
  planned: PlannedUnitSeed[];
  unitsCreated: number;
  contactLinksCreated: number;
};

/**
 * Validates tenant scope, builds the hierarchy plan, inserts units in chunks (~500),
 * then links each unit to its owner contact via `ContactUnit`.
 */
export async function seedUnitHierarchyForProject(
  db: PrismaClient,
  params: SeedUnitHierarchyForProjectParams
): Promise<SeedUnitHierarchyForProjectResult> {
  const {
    organizationId,
    projectId,
    ranges,
    seed,
    ownerContactIds,
    nameBucket: providedBucket,
    unitIdFormatOverride,
  } = params;

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null,
    },
    select: { id: true, unitIdFormat: true },
  });

  if (!project) {
    throw new Error(
      `seedUnitHierarchyForProject: project not found or wrong org / soft-deleted (${projectId})`
    );
  }

  const contacts = await db.contact.findMany({
    where: {
      id: { in: ownerContactIds },
      organizationId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (contacts.length !== ownerContactIds.length) {
    throw new Error(
      'seedUnitHierarchyForProject: one or more owner contacts missing, wrong org, or deleted'
    );
  }

  const nameBucket = providedBucket ?? createUniquenessBucket();

  const unitIdFormat = unitIdFormatOverride ?? project.unitIdFormat;

  const planned = buildPlannedUnitHierarchy({
    organizationId,
    projectId,
    unitIdFormat,
    ranges,
    seed,
    ownerContactIds,
    nameBucket,
  });

  const unitRows = plannedUnitsToCreateManyInput(planned);

  await db.$transaction(async (tx) => {
    await createManyInChunksUnit(
      (data) => tx.unit.createMany({ data }),
      unitRows
    );

    const nameList = planned.map((p) => p.name);
    const inserted = await tx.unit.findMany({
      where: {
        organizationId,
        projectId,
        deletedAt: null,
        name: { in: nameList },
      },
      select: { id: true, name: true },
    });

    if (inserted.length !== planned.length) {
      throw new Error(
        `seedUnitHierarchyForProject: expected ${planned.length} units after insert, found ${inserted.length}`
      );
    }

    const idByName = new Map(inserted.map((u) => [u.name, u.id] as const));

    const linkRows: Prisma.ContactUnitCreateManyInput[] = planned.map((p) => {
      const unitId = idByName.get(p.name);
      if (!unitId) {
        throw new Error(
          `seedUnitHierarchyForProject: missing unit id for name ${p.name}`
        );
      }
      return {
        contactId: p.ownerContactId,
        unitId,
      };
    });

    await createManyInChunksContactUnit(
      (data) => tx.contactUnit.createMany({ data }),
      linkRows
    );
  });

  return {
    planned,
    unitsCreated: planned.length,
    contactLinksCreated: planned.length,
  };
}
