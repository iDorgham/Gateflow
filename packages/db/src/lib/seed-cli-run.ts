/**
 * Phase 9 seed CLI orchestration: legacy dev seed, integrity checks, emulation.
 */

import type { PrismaClient } from '@prisma/client';
import {
  createUniquenessBucket,
  UniquenessViolationError,
  validateUniqueness,
} from './seed-integrity';
import {
  parseSeedCliArgv,
  printSeedCliHelp,
  seedCliWantsEmulation,
  type SeedCliParsed,
} from './seed-cli-args';
import { RUSH_SCENARIOS, type RushScenario } from './rush-hour';
import { runEmulation } from '../advanced-seed-service';
import type { DemoSeedOptions, DemoSeedSummary } from './seed-demo-red-sea';

function assertRushScenario(s: string): RushScenario {
  if (!(RUSH_SCENARIOS as readonly string[]).includes(s)) {
    throw new Error(
      `Invalid --scenario "${s}". Expected one of: ${RUSH_SCENARIOS.join(', ')}`
    );
  }
  return s as RushScenario;
}

/** Fast sanity check for {@link validateUniqueness} (no DB). */
export function runSeedIntegritySelfTest(): void {
  const bucket = createUniquenessBucket();
  const org = 'org_seed_cli_selftest';
  validateUniqueness(bucket, { organizationId: org, email: 'a@example.com' });
  validateUniqueness(bucket, { organizationId: org, email: 'b@example.com' });
  try {
    validateUniqueness(bucket, { organizationId: org, email: 'a@example.com' });
    throw new Error(
      'expected duplicate email to throw UniquenessViolationError'
    );
  } catch (e) {
    if (!(e instanceof UniquenessViolationError)) {
      throw e;
    }
  }
}

/**
 * Read-only SQL: active contacts with duplicate normalized email per org.
 */
export async function countDuplicateContactEmails(
  db: PrismaClient
): Promise<number> {
  const rows = await db.$queryRaw<{ n: bigint }[]>`
    SELECT COUNT(*)::bigint AS n
    FROM (
      SELECT "organizationId", LOWER(TRIM(email)) AS em, COUNT(*)::bigint AS c
      FROM "Contact"
      WHERE "deletedAt" IS NULL
        AND email IS NOT NULL
        AND TRIM(email) <> ''
      GROUP BY 1, 2
      HAVING COUNT(*) > 1
    ) t
  `;
  return Number(rows[0]?.n ?? 0);
}

export async function countDuplicateContactPhones(
  db: PrismaClient
): Promise<number> {
  const rows = await db.$queryRaw<{ n: bigint }[]>`
    SELECT COUNT(*)::bigint AS n
    FROM (
      SELECT "organizationId", TRIM(phone) AS ph, COUNT(*)::bigint AS c
      FROM "Contact"
      WHERE "deletedAt" IS NULL
        AND phone IS NOT NULL
        AND TRIM(phone) <> ''
      GROUP BY 1, 2
      HAVING COUNT(*) > 1
    ) t
  `;
  return Number(rows[0]?.n ?? 0);
}

export async function runSeedIntegrityChecks(db: PrismaClient): Promise<void> {
  runSeedIntegritySelfTest();
  const dupEmail = await countDuplicateContactEmails(db);
  const dupPhone = await countDuplicateContactPhones(db);
  if (dupEmail > 0) {
    throw new Error(
      `[seed-cli] integrity: found ${dupEmail} duplicate active email group(s) in Contact`
    );
  }
  if (dupPhone > 0) {
    throw new Error(
      `[seed-cli] integrity: found ${dupPhone} duplicate active phone group(s) in Contact`
    );
  }
  console.log('[seed-cli] integrity: DB duplicate scan OK (emails & phones).');
}

export async function assertOrganizationCountRange(
  db: PrismaClient,
  min: number | null,
  max: number | null
): Promise<number> {
  const count = await db.organization.count({ where: { deletedAt: null } });
  if (min != null && count < min) {
    throw new Error(
      `[seed-cli] organizations: count ${count} < --organizations.min=${min}`
    );
  }
  if (max != null && count > max) {
    throw new Error(
      `[seed-cli] organizations: count ${count} > --organizations.max=${max}`
    );
  }
  console.log(`[seed-cli] organizations: count=${count} (range OK).`);
  return count;
}

function allowLiveEmulationSeed(): boolean {
  if (process.env.ALLOW_EMULATION_SEED === '1') return true;
  return process.env.NODE_ENV === 'development';
}

export async function runCliEmulation(
  db: PrismaClient,
  parsed: SeedCliParsed
): Promise<void> {
  const orgId = parsed.emulate.organizationId?.trim();
  if (!orgId) {
    throw new Error('Emulation requires --organizationId');
  }

  const scenario = assertRushScenario(
    parsed.emulate.scenario ?? 'luxury-compound'
  );
  const totalScans = parsed.emulate.totalScans ?? 50;
  const pastDays = parsed.emulate.pastDays ?? 7;
  const incidentRate = parsed.emulate.incidentRate ?? 0.05;
  const randomSeed = parsed.emulate.randomSeed ?? 42;
  const dryRun = parsed.dryRun;

  const secret = process.env.QR_SIGNING_SECRET ?? '';
  if (!dryRun) {
    if (!allowLiveEmulationSeed()) {
      throw new Error(
        'Live emulation seed blocked: set NODE_ENV=development or ALLOW_EMULATION_SEED=1'
      );
    }
    if (!secret || secret.length < 32) {
      throw new Error(
        'Live emulation requires QR_SIGNING_SECRET (≥32 chars) in the environment'
      );
    }
  }

  const t0 = Date.now();
  const result = await runEmulation({
    db,
    organizationId: orgId,
    scenario,
    pastDays,
    totalScans,
    incidentRate,
    randomSeed,
    dryRun,
    signingSecret: secret,
    projectId: parsed.emulate.projectId ?? undefined,
    gateId: parsed.emulate.gateId ?? undefined,
    unitId: parsed.emulate.unitId ?? undefined,
    contactId: parsed.emulate.contactId ?? undefined,
    createdByUserId: parsed.emulate.createdByUserId ?? undefined,
  });

  console.log('[seed-cli] emulation summary:', {
    durationMs: Date.now() - t0,
    dryRun: result.dryRun,
    organizationId: result.organizationId,
    scenario: result.scenario,
    totalScans: result.totalScans,
    pastDays: result.pastDays,
    incidentRate: result.incidentRate,
    randomSeed: result.randomSeed,
    windowStartIso: result.windowStartIso,
    windowEndIso: result.windowEndIso,
    relationalChain: result.relationalChain
      ? {
          qrCodeId: result.relationalChain.qrCodeId,
          visitorQrId: result.relationalChain.visitorQrId,
          scanLogsCreated: result.relationalChain.scanLogsCreated,
          chainDepth: result.relationalChain.chainDepth,
        }
      : undefined,
  });
}

export type ExecuteSeedCliDeps = {
  prisma: PrismaClient;
  runLegacyDevSeed: () => Promise<void>;
  runDemoRedSeaSeed?: (
    db: PrismaClient,
    options?: DemoSeedOptions
  ) => Promise<DemoSeedSummary>;
};

/**
 * Main entry for `prisma/seed-entry.ts`. Caller owns prisma disconnect after return.
 */
export async function executeSeedCli(
  argv: string[],
  deps: ExecuteSeedCliDeps
): Promise<void> {
  let parsed: SeedCliParsed;
  try {
    parsed = parseSeedCliArgv(argv);
  } catch (e) {
    console.error('[seed-cli]', e instanceof Error ? e.message : e);
    printSeedCliHelp();
    throw e;
  }

  if (parsed.help) {
    printSeedCliHelp();
    return;
  }

  const { prisma: db, runLegacyDevSeed } = deps;

  if (parsed.testIntegrity) {
    await runSeedIntegrityChecks(db);
    return;
  }

  const wantsEmu = seedCliWantsEmulation(parsed);
  const orgRange =
    parsed.organizationsMin != null || parsed.organizationsMax != null;

  if (orgRange && !parsed.dryRun && !wantsEmu) {
    throw new Error(
      '--organizations.min/max require --dry-run (unless running emulation with org + traffic flags)'
    );
  }

  if (parsed.dryRun && orgRange) {
    await assertOrganizationCountRange(
      db,
      parsed.organizationsMin,
      parsed.organizationsMax
    );
  }

  if (parsed.demoFull) {
    if (parsed.dryRun) {
      console.log('[seed-cli] dry-run: skipping demo-full writes.');
      return;
    }
    await runLegacyDevSeed();
    const runDemo =
      deps.runDemoRedSeaSeed ??
      (await import('./seed-demo-red-sea')).runDemoRedSeaSeed;
    await runDemo(db, { emulate: true, dryRun: false });
    return;
  }

  if (wantsEmu) {
    await runCliEmulation(db, parsed);
    return;
  }

  if (parsed.dryRun) {
    if (orgRange) {
      console.log('[seed-cli] dry-run: organization range check complete.');
      return;
    }
    console.log('[seed-cli] dry-run: skipping legacy dev seed (no writes).');
    return;
  }

  await runLegacyDevSeed();
}
