/**
 * argv parser for `pnpm prisma db seed -- <flags>` (Phase 9).
 * Keep flags aligned with the emulation API and ops reference.
 */

import { RUSH_SCENARIOS } from './rush-hour';

export type SeedCliEmulateSlice = {
  organizationId: string | null;
  emulateFlag: boolean;
  scenario: string | null;
  totalScans: number | null;
  pastDays: number | null;
  incidentRate: number | null;
  randomSeed: number | null;
  projectId: string | null;
  gateId: string | null;
  unitId: string | null;
  contactId: string | null;
  createdByUserId: string | null;
};

export type SeedCliParsed = {
  help: boolean;
  dryRun: boolean;
  testIntegrity: boolean;
  organizationsMin: number | null;
  organizationsMax: number | null;
  emulate: SeedCliEmulateSlice;
};

const EMULATE_STRING_FIELDS: Record<string, keyof SeedCliEmulateSlice> = {
  organizationid: 'organizationId',
  'organization-id': 'organizationId',
  scenario: 'scenario',
  projectid: 'projectId',
  gateid: 'gateId',
  unitid: 'unitId',
  contactid: 'contactId',
  createdbyuserid: 'createdByUserId',
  'created-by-user-id': 'createdByUserId',
};

const EMULATE_NUMBER_FIELDS: Record<string, keyof SeedCliEmulateSlice> = {
  scans: 'totalScans',
  totalscans: 'totalScans',
  pastdays: 'pastDays',
  incidentrate: 'incidentRate',
  seed: 'randomSeed',
  randomseed: 'randomSeed',
};

function normFlagKey(keyPart: string): string {
  return keyPart.trim().toLowerCase();
}

function parseBool(raw: string | undefined): boolean {
  if (raw == null || raw === '') return true;
  const v = raw.toLowerCase();
  if (v === 'false' || v === '0' || v === 'no') return false;
  return true;
}

function parseNumber(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid number: ${raw}`);
  }
  return n;
}

/**
 * Parse argv **after** Node/tsx strips `node` and script path (i.e. only user flags).
 */
export function parseSeedCliArgv(argv: string[]): SeedCliParsed {
  const out: SeedCliParsed = {
    help: false,
    dryRun: false,
    testIntegrity: false,
    organizationsMin: null,
    organizationsMax: null,
    emulate: {
      organizationId: null,
      emulateFlag: false,
      scenario: null,
      totalScans: null,
      pastDays: null,
      incidentRate: null,
      randomSeed: null,
      projectId: null,
      gateId: null,
      unitId: null,
      contactId: null,
      createdByUserId: null,
    },
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      continue;
    }

    const eq = token.indexOf('=');
    const keyPart = eq >= 0 ? token.slice(2, eq) : token.slice(2);
    const inlineVal = eq >= 0 ? token.slice(eq + 1) : undefined;

    let valueStr: string | undefined = inlineVal;
    if (inlineVal === undefined) {
      const peek = argv[i + 1];
      if (peek && !peek.startsWith('-')) {
        valueStr = peek;
        i += 1;
      }
    }

    const nk = normFlagKey(keyPart);

    if (nk === 'help' || nk === 'h') {
      out.help = true;
      continue;
    }
    if (nk === 'dry-run' || nk === 'dryrun') {
      out.dryRun = parseBool(valueStr);
      continue;
    }
    if (nk === 'test-integrity' || nk === 'testintegrity') {
      out.testIntegrity = parseBool(valueStr);
      continue;
    }
    if (nk === 'emulate') {
      out.emulate.emulateFlag = parseBool(valueStr);
      continue;
    }
    if (nk === 'organizations.min') {
      out.organizationsMin = parseNumber(valueStr ?? '');
      continue;
    }
    if (nk === 'organizations.max') {
      out.organizationsMax = parseNumber(valueStr ?? '');
      continue;
    }

    const strField = EMULATE_STRING_FIELDS[nk];
    if (strField) {
      const v = valueStr ?? '';
      const val = v.trim() === '' ? null : v.trim();
      Object.assign(out.emulate, { [strField]: val });
      continue;
    }

    const numField = EMULATE_NUMBER_FIELDS[nk];
    if (numField) {
      Object.assign(out.emulate, {
        [numField]: parseNumber(valueStr ?? ''),
      });
      continue;
    }

    throw new Error(`Unknown flag: --${keyPart}`);
  }

  return out;
}

/** True when CLI should invoke {@link runEmulation} (requires organization id). */
export function seedCliWantsEmulation(parsed: SeedCliParsed): boolean {
  const e = parsed.emulate;
  if (!e.organizationId?.trim()) return false;
  return (
    e.emulateFlag ||
    e.scenario != null ||
    e.totalScans != null ||
    e.pastDays != null ||
    e.incidentRate != null ||
    e.randomSeed != null
  );
}

export function printSeedCliHelp(): void {
  console.log(`
GateFlow Prisma seed CLI (Phase 9)

Usage:
  pnpm prisma db seed
  pnpm prisma db seed -- --help
  pnpm prisma db seed -- --dry-run
  pnpm prisma db seed -- --test-integrity
  pnpm prisma db seed -- --organizations.min=2 --organizations.max=5 --dry-run
  pnpm prisma db seed -- --organizationId=<org> --scenario=nightclub --scans=10000 --pastDays=30 --incidentRate=0.25 --seed=12345 --dry-run

Flags:
  --help                 Show this help
  --dry-run              Skip legacy dev seed writes; emulation respects dry-run (no QR/ScanLog writes)
  --test-integrity       In-memory uniqueness self-test + DB duplicate scan (active contacts)
  --organizations.min=N  With --dry-run: assert org count >= N
  --organizations.max=N With --dry-run: assert org count <= N

Emulation (Phase 7); requires --organizationId and at least one of:
  --emulate, --scenario, --scans/--totalScans, --pastDays, --incidentRate, --seed/--randomSeed

  --organizationId, --organization-id
  --scenario             One of: ${RUSH_SCENARIOS.join(', ')}
  --scans, --totalScans  1–10000
  --pastDays             1–365
  --incidentRate         0–1
  --seed, --randomSeed   Integer
  Optional: --projectId, --gateId, --unitId, --contactId, --createdByUserId

Security:
  Never pass QR_SIGNING_SECRET on argv. Live emulation needs QR_SIGNING_SECRET (≥32 chars) and
  NODE_ENV=development or ALLOW_EMULATION_SEED=1.
`);
}
