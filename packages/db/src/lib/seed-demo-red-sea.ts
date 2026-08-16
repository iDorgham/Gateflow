/**
 * Idempotent Red Sea demo seed: role logins, Hurghada-area projects, contacts/units,
 * and optional 180-day scan emulation for every demo organization.
 */

import { hash } from '@node-rs/argon2';
import { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } from '@gate-access/types';
import type { Prisma, PrismaClient, UnitType } from '@prisma/client';
import { runEmulation } from '../advanced-seed-service';
import { generateRichContact } from './rich-contact';
import { scanLogWhereForOrganization } from './relational-chain-seed';
import {
  createUniquenessBucket,
  validateUniqueness,
  type UniquenessBucket,
} from './seed-integrity';
import {
  DEMO_ORG_SPECS,
  DEMO_PAST_DAYS,
  DEMO_RANDOM_SEED,
  SELENA_PROJECT_SPECS,
  SUPER_ADMIN_EMAIL,
  areaNationalityWeights,
  contactsPerVerticalUnit,
  demoRoleEmails,
  demoStaffProfiles,
  nationalityNotes,
  planRealEstateUnitNames,
  planVerticalUnitNames,
  shouldSkipEmulation,
  spreadCreatedAt,
  unitTypeForVertical,
  type DemoOrgSpec,
  type SelenaProjectSpec,
} from './seed-demo-catalog';
import type { RedSeaArea } from './red-sea-data';
import type { RushScenario } from './rush-hour';

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';
const CONTACT_CHUNK = 100;

export type DemoSeedOptions = {
  dryRun?: boolean;
  emulate?: boolean;
  pastDays?: number;
  seed?: number;
  now?: Date;
};

export type DemoSeedSummary = {
  orgsProcessed: number;
  usersUpserted: number;
  contactsCreated: number;
  unitsCreated: number;
  emulationsRun: number;
  emulationsSkipped: number;
};

function builtInRoleId(key: string): string {
  return `builtin-${key.toLowerCase().replace(/_/g, '-')}`;
}

function allowLiveEmulationSeed(): boolean {
  if (process.env.ALLOW_EMULATION_SEED === '1') return true;
  return process.env.NODE_ENV === 'development';
}

async function upsertBuiltInRoles(db: PrismaClient): Promise<void> {
  for (const [key, name] of Object.entries(BUILT_IN_ROLES)) {
    const permissions = DEFAULT_PERMISSIONS[name];
    await db.role.upsert({
      where: { id: builtInRoleId(key) },
      update: { name, permissions, isBuiltIn: true },
      create: {
        id: builtInRoleId(key),
        name,
        description: `Built-in ${name}`,
        isBuiltIn: true,
        permissions,
      },
    });
  }
}

async function loadContactBucket(
  db: PrismaClient,
  organizationId: string
): Promise<UniquenessBucket> {
  const bucket = createUniquenessBucket();
  const existing = await db.contact.findMany({
    where: { organizationId, deletedAt: null },
    select: { email: true, phone: true },
  });
  for (const row of existing) {
    validateUniqueness(bucket, {
      organizationId,
      email: row.email,
      phone: row.phone,
    });
  }
  return bucket;
}

async function ensureProjectByName(
  db: PrismaClient,
  organizationId: string,
  spec: SelenaProjectSpec
): Promise<{ id: string }> {
  const byName = await db.project.findFirst({
    where: { organizationId, name: spec.name, deletedAt: null },
    select: { id: true },
  });
  if (byName) return byName;

  const byId = await db.project.findUnique({
    where: { id: spec.stableId },
    select: { id: true, organizationId: true, deletedAt: true },
  });
  if (byId && byId.organizationId === organizationId && byId.deletedAt == null) {
    return byId;
  }

  return db.project.create({
    data: {
      ...(byId ? {} : { id: spec.stableId }),
      name: spec.name,
      location: spec.location,
      description: 'Red Sea residential compound',
      organizationId,
    },
    select: { id: true },
  });
}

async function ensureGates(
  db: PrismaClient,
  organizationId: string,
  projectId: string,
  gateNames: readonly string[]
): Promise<void> {
  for (const name of gateNames) {
    const existing = await db.gate.findFirst({
      where: { organizationId, projectId, name, deletedAt: null },
      select: { id: true },
    });
    if (existing) continue;
    await db.gate.create({
      data: {
        name,
        location: name,
        organizationId,
        projectId,
      },
    });
  }
}

async function createContactsForProject(
  db: PrismaClient,
  params: {
    organizationId: string;
    area: RedSeaArea;
    jobTitle: string;
    needed: number;
    sequenceStart: number;
    seed: number;
    pastDays: number;
    now: Date;
    bucket: UniquenessBucket;
  }
): Promise<string[]> {
  if (params.needed <= 0) return [];

  const weights = areaNationalityWeights(params.area);
  const payloads: Prisma.ContactCreateManyInput[] = [];

  for (let i = 0; i < params.needed; i++) {
    const rich = generateRichContact({
      organizationId: params.organizationId,
      seed: params.seed,
      sequence: params.sequenceStart + i,
      bucket: params.bucket,
      nationalityWeights: weights,
    });
    payloads.push({
      organizationId: params.organizationId,
      firstName: rich.firstName,
      lastName: rich.lastName,
      email: rich.email,
      phone: rich.phone,
      jobTitle: params.jobTitle,
      company: rich.company,
      notes: nationalityNotes(rich.nationality),
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(rich.email)}`,
      createdAt: spreadCreatedAt(i, params.needed, params.pastDays, params.now),
    });
  }

  for (let i = 0; i < payloads.length; i += CONTACT_CHUNK) {
    const batch = payloads.slice(i, i + CONTACT_CHUNK);
    await db.contact.createMany({ data: batch, skipDuplicates: true });
  }

  const emails = payloads.map((p) => p.email).filter((e): e is string => !!e);
  const inserted = await db.contact.findMany({
    where: {
      organizationId: params.organizationId,
      deletedAt: null,
      email: { in: emails },
    },
    select: { id: true, email: true },
  });
  const byEmail = new Map(inserted.map((c) => [c.email, c.id]));
  return emails.map((e) => byEmail.get(e)).filter((id): id is string => !!id);
}

async function ensureUnitsNamed(
  db: PrismaClient,
  params: {
    organizationId: string;
    projectId: string;
    names: string[];
    orgType: DemoOrgSpec['type'];
    pastDays: number;
    now: Date;
  }
): Promise<{ unitIds: string[]; created: number }> {
  const existing = await db.unit.findMany({
    where: {
      organizationId: params.organizationId,
      projectId: params.projectId,
      deletedAt: null,
    },
    select: { id: true, name: true },
  });
  const byName = new Map(existing.map((u) => [u.name, u.id]));
  let created = 0;

  const missing = params.names.filter((n) => !byName.has(n));
  for (let i = 0; i < missing.length; i++) {
    const name = missing[i]!;
    const type: UnitType = unitTypeForVertical(
      params.orgType,
      existing.length + i
    );
    const row = await db.unit.create({
      data: {
        name,
        type,
        organizationId: params.organizationId,
        projectId: params.projectId,
        createdAt: spreadCreatedAt(
          i,
          Math.max(missing.length, 1),
          params.pastDays,
          params.now
        ),
      },
      select: { id: true, name: true },
    });
    byName.set(row.name, row.id);
    created += 1;
  }

  const unitIds = params.names
    .map((n) => byName.get(n))
    .filter((id): id is string => !!id);
  return { unitIds, created };
}

async function linkContactsRoundRobin(
  db: PrismaClient,
  unitIds: string[],
  contactIds: string[]
): Promise<void> {
  if (unitIds.length === 0 || contactIds.length === 0) return;
  const rows: Prisma.ContactUnitCreateManyInput[] = contactIds.map(
    (contactId, i) => ({
      contactId,
      unitId: unitIds[i % unitIds.length]!,
    })
  );
  await db.contactUnit.createMany({ data: rows, skipDuplicates: true });
}

async function seedSelenaProjects(
  db: PrismaClient,
  organizationId: string,
  spec: DemoOrgSpec,
  opts: {
    seed: number;
    pastDays: number;
    now: Date;
    bucket: UniquenessBucket;
  }
): Promise<{ contactsCreated: number; unitsCreated: number }> {
  let contactsCreated = 0;
  let unitsCreated = 0;
  let sequenceStart = 0;

  for (const projectSpec of SELENA_PROJECT_SPECS) {
    const project = await ensureProjectByName(db, organizationId, projectSpec);
    await ensureGates(
      db,
      organizationId,
      project.id,
      projectSpec.gateNames
    );

    const existingUnits = await db.unit.count({
      where: {
        organizationId,
        projectId: project.id,
        deletedAt: null,
      },
    });
    let unitIds: string[] = [];
    if (existingUnits < projectSpec.unitTarget) {
      const unitNames = planRealEstateUnitNames(
        projectSpec.unitPrefix,
        projectSpec.unitTarget
      );
      const units = await ensureUnitsNamed(db, {
        organizationId,
        projectId: project.id,
        names: unitNames,
        orgType: spec.type,
        pastDays: opts.pastDays,
        now: opts.now,
      });
      unitsCreated += units.created;
      unitIds = units.unitIds;
    }

    const linkedContacts = await db.contactUnit.count({
      where: { unit: { projectId: project.id, organizationId } },
    });
    const needed = Math.max(0, projectSpec.contactTarget - linkedContacts);
    const newIds = await createContactsForProject(db, {
      organizationId,
      area: projectSpec.area,
      jobTitle: spec.contactJobTitle,
      needed,
      sequenceStart,
      seed: opts.seed,
      pastDays: opts.pastDays,
      now: opts.now,
      bucket: opts.bucket,
    });
    sequenceStart += projectSpec.contactTarget + 50;
    contactsCreated += newIds.length;

    if (unitIds.length === 0) {
      unitIds = (
        await db.unit.findMany({
          where: { organizationId, projectId: project.id, deletedAt: null },
          select: { id: true },
          take: projectSpec.unitTarget,
        })
      ).map((u) => u.id);
    }
    await linkContactsRoundRobin(db, unitIds, newIds);
  }

  return { contactsCreated, unitsCreated };
}

async function seedVerticalOrg(
  db: PrismaClient,
  organizationId: string,
  spec: DemoOrgSpec,
  opts: {
    seed: number;
    pastDays: number;
    now: Date;
    bucket: UniquenessBucket;
  }
): Promise<{ contactsCreated: number; unitsCreated: number }> {
  let project = await db.project.findFirst({
    where: { organizationId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (!project) {
    project = await db.project.create({
      data: {
        name: spec.area === 'HURGHADA' ? 'Hurghada Campus' : spec.name,
        location: spec.area.replace(/_/g, ' '),
        organizationId,
      },
      select: { id: true },
    });
  }

  const gateCount = await db.gate.count({
    where: { organizationId, projectId: project.id, deletedAt: null },
  });
  if (gateCount === 0) {
    await ensureGates(db, organizationId, project.id, ['Main Gate', 'Gate 2']);
  }

  const names = planVerticalUnitNames(spec.type);
  const units = await ensureUnitsNamed(db, {
    organizationId,
    projectId: project.id,
    names,
    orgType: spec.type,
    pastDays: opts.pastDays,
    now: opts.now,
  });

  const perUnit = contactsPerVerticalUnit(spec.type);
  const linkedContacts = await db.contactUnit.count({
    where: { unit: { organizationId } },
  });
  const needed = Math.max(0, names.length * perUnit - linkedContacts);
  const newIds = await createContactsForProject(db, {
    organizationId,
    area: spec.area,
    jobTitle: spec.contactJobTitle,
    needed,
    sequenceStart: 0,
    seed: opts.seed,
    pastDays: opts.pastDays,
    now: opts.now,
    bucket: opts.bucket,
  });
  await linkContactsRoundRobin(db, units.unitIds, newIds);

  return { contactsCreated: newIds.length, unitsCreated: units.created };
}

async function ensureRoleUsers(
  db: PrismaClient,
  organizationId: string,
  spec: DemoOrgSpec,
  passwordHash: string
): Promise<number> {
  let upserted = 0;
  const roleIds = {
    security: builtInRoleId('SECURITY_MANAGER'),
    guard: builtInRoleId('GATE_OPERATOR'),
    resident: builtInRoleId('RESIDENT'),
  } as const;

  for (const profile of demoStaffProfiles(spec.emailDomain)) {
    const roleId = roleIds[profile.roleKey];
    await db.user.upsert({
      where: { email: profile.email },
      update: {
        passwordHash,
        organizationId,
        roleId,
        name: profile.name,
        deletedAt: null,
      },
      create: {
        email: profile.email,
        name: profile.name,
        passwordHash,
        organizationId,
        roleId,
      },
    });
    upserted += 1;
  }

  const emails = demoRoleEmails(spec.emailDomain);
  const guard = await db.user.findUnique({
    where: { email: emails.guard },
    select: { id: true },
  });
  const resident = await db.user.findUnique({
    where: { email: emails.resident },
    select: { id: true },
  });

  if (guard) {
    const gate = await db.gate.findFirst({
      where: { organizationId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });
    if (gate) {
      await db.gateAssignment.upsert({
        where: {
          userId_gateId: { userId: guard.id, gateId: gate.id },
        },
        update: { deletedAt: null },
        create: {
          userId: guard.id,
          gateId: gate.id,
          organizationId,
        },
      });
    }
  }

  if (resident) {
    const alreadyLinked = await db.unit.findFirst({
      where: { userId: resident.id },
      select: { id: true },
    });
    if (!alreadyLinked) {
      const unit = await db.unit.findFirst({
        where: { organizationId, deletedAt: null, userId: null },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      });
      if (unit) {
        await db.unit.update({
          where: { id: unit.id },
          data: { userId: resident.id },
        });
      }
    }
  }

  return upserted;
}

async function emulateOrgIfNeeded(
  db: PrismaClient,
  spec: DemoOrgSpec,
  organizationId: string,
  pastDays: number,
  seed: number
): Promise<'ran' | 'skipped'> {
  const existing = await db.scanLog.count({
    where: scanLogWhereForOrganization(organizationId),
  });
  if (shouldSkipEmulation(existing, spec.scanTarget)) {
    console.log(
      `[seed-demo] skip emulation ${spec.name}: ${existing} scans already >= ${spec.scanTarget}`
    );
    return 'skipped';
  }

  const secret = process.env.QR_SIGNING_SECRET ?? '';
  if (!allowLiveEmulationSeed()) {
    console.warn(
      `[seed-demo] skip emulation ${spec.name}: set NODE_ENV=development or ALLOW_EMULATION_SEED=1`
    );
    return 'skipped';
  }
  if (!secret || secret.length < 32) {
    console.warn(
      `[seed-demo] skip emulation ${spec.name}: QR_SIGNING_SECRET (≥32 chars) is required`
    );
    return 'skipped';
  }

  const remaining = Math.min(spec.scanTarget - existing, spec.scanTarget);
  await runEmulation({
    db,
    organizationId,
    scenario: spec.rushScenario as RushScenario,
    pastDays,
    totalScans: Math.max(1, remaining),
    incidentRate: 0.05,
    randomSeed: seed,
    dryRun: false,
    signingSecret: secret,
  });
  return 'ran';
}

/**
 * Fill every demo organization with Red Sea contacts/units, role logins, and
 * optional 6-month scan history. Safe to re-run.
 */
export async function runDemoRedSeaSeed(
  db: PrismaClient,
  options: DemoSeedOptions = {}
): Promise<DemoSeedSummary> {
  const dryRun = options.dryRun === true;
  const emulate = options.emulate !== false;
  const pastDays = options.pastDays ?? DEMO_PAST_DAYS;
  const seed = options.seed ?? DEMO_RANDOM_SEED;
  const now = options.now ?? new Date();

  const summary: DemoSeedSummary = {
    orgsProcessed: 0,
    usersUpserted: 0,
    contactsCreated: 0,
    unitsCreated: 0,
    emulationsRun: 0,
    emulationsSkipped: 0,
  };

  if (dryRun) {
    console.log('[seed-demo] dry-run: skipping Red Sea demo writes');
    return summary;
  }

  console.log('[seed-demo] starting Red Sea demo seed…');
  await upsertBuiltInRoles(db);

  const passwordHash = await hash(DEFAULT_PASSWORD, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  await db.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {
      passwordHash,
      roleId: builtInRoleId('SUPER_ADMIN'),
      organizationId: null,
      name: 'Youssef Nasser',
      deletedAt: null,
    },
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: 'Youssef Nasser',
      passwordHash,
      roleId: builtInRoleId('SUPER_ADMIN'),
      organizationId: null,
    },
  });
  summary.usersUpserted += 1;

  for (const spec of DEMO_ORG_SPECS) {
    const org = await db.organization.findFirst({
      where: { email: spec.orgEmail, deletedAt: null },
      select: { id: true },
    });
    if (!org) {
      console.warn(`[seed-demo] org not found: ${spec.orgEmail} (run legacy seed first)`);
      continue;
    }

    const bucket = await loadContactBucket(db, org.id);
    const seeded =
      spec.type === 'REAL_ESTATE'
        ? await seedSelenaProjects(db, org.id, spec, {
            seed,
            pastDays,
            now,
            bucket,
          })
        : await seedVerticalOrg(db, org.id, spec, {
            seed,
            pastDays,
            now,
            bucket,
          });

    summary.contactsCreated += seeded.contactsCreated;
    summary.unitsCreated += seeded.unitsCreated;
    summary.usersUpserted += await ensureRoleUsers(
      db,
      org.id,
      spec,
      passwordHash
    );
    summary.orgsProcessed += 1;

    if (emulate) {
      const result = await emulateOrgIfNeeded(
        db,
        spec,
        org.id,
        pastDays,
        seed
      );
      if (result === 'ran') summary.emulationsRun += 1;
      else summary.emulationsSkipped += 1;
    }
  }

  console.log('[seed-demo] complete:', summary);
  return summary;
}
