/**
 * Orchestration for advanced seeding phases (units, traffic, QR chain — incremental).
 */

import type { Prisma, PrismaClient, UnitIdFormat } from '@prisma/client';
import { QRCodeType, ScanStatus } from '@prisma/client';
import { BUILT_IN_ROLES } from '@gate-access/types';
import {
  buildPlannedUnitHierarchy,
  plannedUnitsToCreateManyInput,
  type PlannedUnitSeed,
  type UnitHierarchyRangeConfig,
} from './lib/unit-hierarchy-seed';
import { createUniquenessBucket } from './lib/seed-integrity';
import type { UniquenessBucket } from './lib/seed-integrity';
import {
  buildSignedVisitorQRCodeString,
  deterministicScanUuid,
  RELATIONAL_SEED_CHAIN_DEPTH,
} from './lib/relational-chain-seed';
import { mulberry32 } from './lib/red-sea-data';
import { sampleScanTimestamps, type RushScenario } from './lib/rush-hour';

function randomUUID(): string {
  const c = globalThis.crypto;
  if (!c?.randomUUID) {
    throw new Error(
      'globalThis.crypto.randomUUID is required for advanced seeding (Node 19+ / modern runtimes)'
    );
  }
  return c.randomUUID();
}

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

async function createManyInChunksScanLog(
  run: (batch: Prisma.ScanLogCreateManyInput[]) => Promise<{ count?: number }>,
  rows: Prisma.ScanLogCreateManyInput[]
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

export type SeedRelationalChainConfig = {
  db: PrismaClient;
  organizationId: string;
  projectId: string;
  gateId: string;
  unitId: string;
  contactId: string;
  createdByUserId: string;
  /** Must match `QR_SIGNING_SECRET` (≥ 32 chars). */
  signingSecret: string;
  /** Phase 5 / `sampleScanTimestamps` ISO strings, sorted ascending. */
  scannedAtIsos: readonly string[];
  /**
   * When set, each `scanUuid` is {@link deterministicScanUuid}(scanUuidSeed, index).
   * When omitted, `randomUUID()` is used (still unique within the batch).
   */
  scanUuidSeed?: number;
  /** Fraction of scans marked `FAILED` (deterministic PRNG). */
  failedScanFraction?: number;
  /** Seed for the failed-scan PRNG (defaults with `scanUuidSeed` when both set). */
  statusRngSeed?: number;
};

export type SeedRelationalChainResult = {
  qrCodeId: string;
  visitorQrId: string;
  signedCode: string;
  scanLogsCreated: number;
  /** Number of relational layers documented for tests / dashboards. */
  chainDepth: typeof RELATIONAL_SEED_CHAIN_DEPTH;
};

/**
 * Creates **one** signed VISITOR {@link QRCode}, {@link VisitorQR}, and batched {@link ScanLog} rows
 * for Phase 6 emulation (org-scoped reads, HMAC-signed `code`, unique `scanUuid` per scan).
 */
export async function seedRelationalChain(
  config: SeedRelationalChainConfig
): Promise<SeedRelationalChainResult> {
  const {
    db,
    organizationId,
    projectId,
    gateId,
    unitId,
    contactId,
    createdByUserId,
    signingSecret,
    scannedAtIsos,
    scanUuidSeed,
    failedScanFraction = 0,
    statusRngSeed,
  } = config;

  if (scannedAtIsos.length < 1) {
    throw new Error('seedRelationalChain: scannedAtIsos must be non-empty');
  }

  const gate = await db.gate.findFirst({
    where: { id: gateId, organizationId, deletedAt: null },
    select: { id: true, projectId: true },
  });
  if (!gate) {
    throw new Error(
      'seedRelationalChain: gate not found, wrong organization, or soft-deleted'
    );
  }
  if (gate.projectId != null && gate.projectId !== projectId) {
    throw new Error(
      'seedRelationalChain: gate.projectId does not match configured projectId'
    );
  }

  const unit = await db.unit.findFirst({
    where: { id: unitId, organizationId, projectId, deletedAt: null },
    select: { id: true },
  });
  if (!unit) {
    throw new Error(
      'seedRelationalChain: unit not found, wrong org/project, or soft-deleted'
    );
  }

  const contact = await db.contact.findFirst({
    where: { id: contactId, organizationId, deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });
  if (!contact) {
    throw new Error(
      'seedRelationalChain: contact not found, wrong organization, or soft-deleted'
    );
  }

  const user = await db.user.findFirst({
    where: { id: createdByUserId, organizationId, deletedAt: null },
    select: { id: true },
  });
  if (!user) {
    throw new Error(
      'seedRelationalChain: createdBy user not found, wrong organization, or soft-deleted'
    );
  }

  const guestName = `${contact.firstName} ${contact.lastName}`.trim();
  const qrId = randomUUID();
  const nonce = randomUUID();
  const issuedAt = new Date().toISOString();
  const maxUses = Math.max(scannedAtIsos.length + 50, 1);

  const signedCode = buildSignedVisitorQRCodeString({
    qrId,
    organizationId,
    maxUses,
    expiresAt: null,
    issuedAt,
    nonce,
    secret: signingSecret,
  });

  const frac = Math.min(1, Math.max(0, failedScanFraction));
  const rngSeed = (statusRngSeed ?? scanUuidSeed ?? 0x9e3779b9) ^ 0x51f4e4b1;
  const statusRng = mulberry32(rngSeed >>> 0);
  const scanUuidSeen = new Set<string>();

  const scanRows: Prisma.ScanLogCreateManyInput[] = scannedAtIsos.map(
    (iso, i) => {
      const scanUuid =
        scanUuidSeed !== undefined
          ? deterministicScanUuid(scanUuidSeed, i)
          : randomUUID();
      if (scanUuidSeen.has(scanUuid)) {
        throw new Error('seedRelationalChain: duplicate scanUuid in batch');
      }
      scanUuidSeen.add(scanUuid);

      const status =
        frac > 0 && statusRng() < frac ? ScanStatus.FAILED : ScanStatus.SUCCESS;

      return {
        status,
        scannedAt: new Date(iso),
        gateId,
        qrCodeId: qrId,
        scanUuid,
      };
    }
  );

  const result = await db.$transaction(async (tx) => {
    await tx.qRCode.create({
      data: {
        id: qrId,
        code: signedCode,
        type: QRCodeType.VISITOR,
        organizationId,
        gateId,
        projectId,
        maxUses,
        currentUses: scanRows.length,
        expiresAt: null,
        isActive: true,
        contactId,
        guestName: guestName.length > 0 ? guestName : null,
        guestEmail: contact.email,
        guestPhone: contact.phone,
      },
    });

    const visitor = await tx.visitorQR.create({
      data: {
        qrCodeId: qrId,
        unitId,
        visitorName: guestName.length > 0 ? guestName : null,
        visitorEmail: contact.email,
        visitorPhone: contact.phone,
        createdBy: createdByUserId,
        isOpenQR: false,
      },
      select: { id: true },
    });

    await createManyInChunksScanLog(
      (data) => tx.scanLog.createMany({ data }),
      scanRows
    );

    return { visitorQrId: visitor.id };
  });

  return {
    qrCodeId: qrId,
    visitorQrId: result.visitorQrId,
    signedCode,
    scanLogsCreated: scanRows.length,
    chainDepth: RELATIONAL_SEED_CHAIN_DEPTH,
  };
}

// ─── Phase 7: live emulation orchestration ───────────────────────────────────

export class EmulationResolutionError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'EmulationResolutionError';
    this.code = code;
  }
}

const EMULATION_MAX_TOTAL_SCANS = 10_000;
const EMULATION_MAX_PAST_DAYS = 365;

export type RunEmulationParams = {
  db: PrismaClient;
  organizationId: string;
  scenario: RushScenario;
  pastDays: number;
  totalScans: number;
  incidentRate: number;
  randomSeed: number;
  dryRun: boolean;
  signingSecret: string;
  projectId?: string;
  gateId?: string;
  unitId?: string;
  contactId?: string;
  createdByUserId?: string;
  /** v4: Advanced seeding ranges (Phase 4 of v3) */
  ranges?: UnitHierarchyRangeConfig;
  /** v4: Unit ID naming pattern (Phase 2 of v3) */
  unitIdFormat?: UnitIdFormat;
};

export type RunEmulationResult = {
  dryRun: boolean;
  organizationId: string;
  projectId: string;
  gateId: string;
  unitId: string;
  contactId: string;
  createdByUserId: string;
  scenario: RushScenario;
  pastDays: number;
  totalScans: number;
  incidentRate: number;
  randomSeed: number;
  windowStartIso: string;
  windowEndIso: string;
  relationalChain?: SeedRelationalChainResult;
  /** v4: Details of seeded hierarchy (if ranges provided) */
  seeded?: SeedUnitHierarchyForProjectResult;
};

async function resolveEmulationContext(
  db: PrismaClient,
  organizationId: string,
  o: Pick<
    RunEmulationParams,
    'projectId' | 'gateId' | 'unitId' | 'contactId' | 'createdByUserId'
  >
): Promise<{
  projectId: string;
  gateId: string;
  unitId: string;
  contactId: string;
  createdByUserId: string;
}> {
  const project = o.projectId
    ? await db.project.findFirst({
        where: {
          id: o.projectId,
          organizationId,
          deletedAt: null,
        },
        select: { id: true },
      })
    : await db.project.findFirst({
        where: { organizationId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      });

  if (!project) {
    throw new EmulationResolutionError(
      'NO_PROJECT',
      'No active project found for organization (or invalid projectId)'
    );
  }

  const gate = o.gateId
    ? await db.gate.findFirst({
        where: {
          id: o.gateId,
          organizationId,
          deletedAt: null,
        },
        select: { id: true, projectId: true },
      })
    : await db.gate.findFirst({
        where: {
          organizationId,
          deletedAt: null,
          OR: [{ projectId: project.id }, { projectId: null }],
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true, projectId: true },
      });

  if (!gate) {
    throw new EmulationResolutionError(
      'NO_GATE',
      'No gate found for organization (or invalid gateId)'
    );
  }

  if (gate.projectId != null && gate.projectId !== project.id) {
    throw new EmulationResolutionError(
      'GATE_PROJECT_MISMATCH',
      'Gate belongs to a different project than the resolved project'
    );
  }

  const unit = o.unitId
    ? await db.unit.findFirst({
        where: {
          id: o.unitId,
          organizationId,
          projectId: project.id,
          deletedAt: null,
        },
        select: { id: true },
      })
    : await db.unit.findFirst({
        where: {
          organizationId,
          projectId: project.id,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });

  if (!unit) {
    throw new EmulationResolutionError(
      'NO_UNIT',
      'No unit found for project (or invalid unitId)'
    );
  }

  const contact = o.contactId
    ? await db.contact.findFirst({
        where: {
          id: o.contactId,
          organizationId,
          deletedAt: null,
        },
        select: { id: true },
      })
    : await db.contact.findFirst({
        where: { organizationId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      });

  if (!contact) {
    throw new EmulationResolutionError(
      'NO_CONTACT',
      'No contact found for organization (or invalid contactId)'
    );
  }

  const user = o.createdByUserId
    ? await db.user.findFirst({
        where: {
          id: o.createdByUserId,
          organizationId,
          deletedAt: null,
        },
        select: { id: true },
      })
    : await db.user.findFirst({
        where: {
          organizationId,
          deletedAt: null,
          role: { name: { not: BUILT_IN_ROLES.RESIDENT } },
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      });

  if (!user) {
    throw new EmulationResolutionError(
      'NO_STAFF_USER',
      'No non-resident user found for createdBy (or invalid createdByUserId)'
    );
  }

  return {
    projectId: project.id,
    gateId: gate.id,
    unitId: unit.id,
    contactId: contact.id,
    createdByUserId: user.id,
  };
}

/**
 * Phase 7 entrypoint: sample rush-hour timestamps for a target org, then (unless `dryRun`)
 * insert signed visitor QR + scan logs via {@link seedRelationalChain}.
 */
export async function runEmulation(
  params: RunEmulationParams
): Promise<RunEmulationResult> {
  const {
    db,
    organizationId,
    scenario,
    pastDays,
    totalScans,
    incidentRate,
    randomSeed,
    dryRun,
    signingSecret,
    projectId: projectIdOpt,
    gateId: gateIdOpt,
    unitId: unitIdOpt,
    contactId: contactIdOpt,
    createdByUserId: createdByOpt,
  } = params;

  if (totalScans < 1 || totalScans > EMULATION_MAX_TOTAL_SCANS) {
    throw new Error(
      `runEmulation: totalScans must be between 1 and ${EMULATION_MAX_TOTAL_SCANS}`
    );
  }
  if (pastDays < 1 || pastDays > EMULATION_MAX_PAST_DAYS) {
    throw new Error(
      `runEmulation: pastDays must be between 1 and ${EMULATION_MAX_PAST_DAYS}`
    );
  }

  const frac = Math.min(1, Math.max(0, incidentRate));

  const windowEnd = new Date();
  const windowStart = new Date(
    windowEnd.getTime() - pastDays * 24 * 60 * 60 * 1000
  );

  const scannedAtIsos = sampleScanTimestamps({
    count: totalScans,
    scenario,
    windowStart,
    windowEnd,
    seed: randomSeed,
  });

  const ctx = await resolveEmulationContext(db, organizationId, {
    projectId: projectIdOpt,
    gateId: gateIdOpt,
    unitId: unitIdOpt,
    contactId: contactIdOpt,
    createdByUserId: createdByOpt,
  });

  let seeded: SeedUnitHierarchyForProjectResult | undefined;
  let finalUnitId = ctx.unitId;
  let finalContactId = ctx.contactId;

  if (params.ranges && !dryRun) {
    // Phase 4 of v3: Seed structural hierarchy before traffic
    // We need at least one owner contact for the round-robin linking
    let ownerContactIds = [ctx.contactId];

    // If we're seeding a lot, let's try to get more contacts from the org to distribute ownership
    const existing = await db.contact.findMany({
      where: { organizationId, deletedAt: null },
      take: 10,
      select: { id: true },
    });
    if (existing.length > 1) {
      ownerContactIds = existing.map((c) => c.id);
    }

    seeded = await seedUnitHierarchyForProject(db, {
      organizationId,
      projectId: ctx.projectId,
      ranges: params.ranges,
      seed: randomSeed,
      ownerContactIds,
      unitIdFormatOverride: params.unitIdFormat,
    });

    // Pick one of the newly seeded units as the anchor for the relational scan chain
    if (seeded.planned.length > 0) {
      const firstTarget = seeded.planned[0]!;
      const inserted = await db.unit.findFirst({
        where: {
          organizationId,
          projectId: ctx.projectId,
          name: firstTarget.name,
          deletedAt: null,
        },
        select: {
          id: true,
          contacts: {
            take: 1,
            select: { contactId: true },
          },
        },
      });
      if (inserted) {
        finalUnitId = inserted.id;
        finalContactId = inserted.contacts[0]?.contactId ?? ownerContactIds[0];
      }
    }
  }

  if (dryRun) {
    return {
      dryRun: true,
      organizationId,
      ...ctx,
      scenario,
      pastDays,
      totalScans,
      incidentRate: frac,
      randomSeed,
      windowStartIso: windowStart.toISOString(),
      windowEndIso: windowEnd.toISOString(),
    };
  }

  const relationalChain = await seedRelationalChain({
    db,
    organizationId,
    projectId: ctx.projectId,
    gateId: ctx.gateId,
    unitId: finalUnitId,
    contactId: finalContactId,
    createdByUserId: ctx.createdByUserId,
    signingSecret,
    scannedAtIsos,
    scanUuidSeed: randomSeed,
    failedScanFraction: frac,
    statusRngSeed: randomSeed ^ 0x51f4e4b1,
  });

  return {
    dryRun: false,
    organizationId,
    ...ctx,
    unitId: finalUnitId,
    contactId: finalContactId,
    scenario,
    pastDays,
    totalScans,
    incidentRate: frac,
    randomSeed,
    windowStartIso: windowStart.toISOString(),
    windowEndIso: windowEnd.toISOString(),
    relationalChain,
    seeded,
  };
}
