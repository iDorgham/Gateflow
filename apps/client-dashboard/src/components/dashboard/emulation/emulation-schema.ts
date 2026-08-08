/**
 * Client-side mirror of `POST /api/admin/emulate-traffic` (route.ts).
 * Keep field constraints aligned with the API Zod schema.
 */

import { z } from 'zod';

export const RUSH_SCENARIOS = [
  'luxury-compound',
  'nightclub',
  'private-school',
  'wedding-venue',
] as const;

export type RushScenarioClient = (typeof RUSH_SCENARIOS)[number];

export const ScenarioEnum = z.enum(RUSH_SCENARIOS);

export const EmulateTrafficBodySchema = z.object({
  organizationId: z.string().min(1),
  scenario: ScenarioEnum,
  pastDays: z.number().int().min(1).max(365),
  totalScans: z.number().int().min(1).max(10_000),
  incidentRate: z.number().min(0).max(1),
  randomSeed: z.number().int(),
  dryRun: z.boolean().optional().default(false),
  projectId: z.string().min(1).optional(),
  gateId: z.string().min(1).optional(),
  unitId: z.string().min(1).optional(),
  contactId: z.string().min(1).optional(),
  createdByUserId: z.string().min(1).optional(),
});

export type EmulateTrafficBody = z.infer<typeof EmulateTrafficBodySchema>;

export const emulationStep0Schema = EmulateTrafficBodySchema.pick({
  organizationId: true,
  pastDays: true,
  totalScans: true,
  incidentRate: true,
  randomSeed: true,
});

/** Matches Prisma `UnitIdFormat` (advanced seeding / CRM unit naming). */
export const UNIT_ID_FORMATS = [
  'COMPACT',
  'BUILDING_FIRST',
  'SIMPLE',
  'LOCATION',
  'DESCRIPTIVE',
  'GLOBAL',
] as const;

export type UnitIdFormatKey = (typeof UNIT_ID_FORMATS)[number];

export function buildEmulateTrafficBody(input: {
  organizationId: string;
  scenario: RushScenarioClient;
  pastDays: number;
  totalScans: number;
  incidentRate: number;
  randomSeed: number;
  dryRun: boolean;
  projectId: string;
  gateId: string;
  unitId: string;
  contactId: string;
  createdByUserId: string;
}): EmulateTrafficBody {
  const base: EmulateTrafficBody = {
    organizationId: input.organizationId.trim(),
    scenario: input.scenario,
    pastDays: input.pastDays,
    totalScans: input.totalScans,
    incidentRate: input.incidentRate,
    randomSeed: input.randomSeed,
    dryRun: input.dryRun,
  };

  const opt = (
    key: 'projectId' | 'gateId' | 'unitId' | 'contactId' | 'createdByUserId',
    val: string
  ) => {
    const t = val.trim();
    if (t.length > 0) base[key] = t;
  };

  opt('projectId', input.projectId);
  opt('gateId', input.gateId);
  opt('unitId', input.unitId);
  opt('contactId', input.contactId);
  opt('createdByUserId', input.createdByUserId);

  return EmulateTrafficBodySchema.parse(base);
}

export function validateStep0(input: {
  organizationId: string;
  pastDays: number;
  totalScans: number;
  incidentRate: number;
  randomSeed: number;
}): string | null {
  const r = emulationStep0Schema.safeParse(input);
  if (!r.success) {
    return r.error.issues[0]?.message ?? 'Validation failed';
  }
  return null;
}

export function validateScenario(
  scenario: string
): scenario is RushScenarioClient {
  return (RUSH_SCENARIOS as readonly string[]).includes(scenario);
}
