/**
 * ## POST /api/admin/emulate-traffic
 *
 * **Auth:** Admin Session Cookie — **Internal Admin** only.
 *
 * **Rate limit:** 5 requests per hour.
 *
 * **Body (JSON):**
 * - `organizationId` (string, required) — target tenant; must exist and not be soft-deleted.
 * - `scenario` — `luxury-compound` | `nightclub` | `private-school` | `wedding-venue`
 * - `pastDays` (int 1–365) — scan window ends at “now”, starts `pastDays` ago.
 * - `totalScans` (int 1–10000)
 * - `incidentRate` (number 0–1) — fraction of scans stored as `FAILED`.
 * - `randomSeed` (int) — rush-hour + scan UUID determinism.
 * - `dryRun` (boolean, default false) — validate resolution + sample timestamps only; no QR/ScanLog writes.
 * - Optional overrides: `projectId`, `gateId`, `unitId`, `contactId`, `createdByUserId`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  prisma,
  runEmulation,
  RUSH_SCENARIOS,
  AiActionStatus,
  type PrismaClient,
} from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const RUSH_SCENARIOS_INTERNAL = RUSH_SCENARIOS as unknown as [
  string,
  ...string[],
];
const ScenarioEnum = z.enum(RUSH_SCENARIOS_INTERNAL);

const EmulateTrafficBodySchema = z.object({
  organizationId: z.string().min(1),
  scenario: ScenarioEnum,
  pastDays: z.number().int().min(1).max(365),
  totalScans: z.number().int().min(1).max(10_000),
  incidentRate: z.number().min(0).max(1),
  randomSeed: z.number().int(),
  dryRun: z.boolean().optional().default(false),
  globalMode: z.boolean().optional().default(false),
  projectId: z.string().min(1).optional(),
  gateId: z.string().min(1).optional(),
  unitId: z.string().min(1).optional(),
  contactId: z.string().min(1).optional(),
  createdByUserId: z.string().min(1).optional(),
  /** v4: Advanced seeding ranges */
  ranges: z
    .object({
      minPhases: z.number().int().min(1).max(32),
      maxPhases: z.number().int().min(1).max(32),
      minBuildingsPerPhase: z.number().int().min(1).max(32),
      maxBuildingsPerPhase: z.number().int().min(1).max(32),
      minFloorsPerBuilding: z.number().int().min(1).max(32),
      maxFloorsPerBuilding: z.number().int().min(1).max(32),
      minUnitsPerFloor: z.number().int().min(1).max(32),
      maxUnitsPerFloor: z.number().int().min(1).max(40),
    })
    .optional(),
  /** v4: Unit ID naming pattern */
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
});

function isEmulationResolutionError(
  err: unknown
): err is { code: string; message: string; name: string } {
  if (!err || typeof err !== 'object') return false;
  const o = err as Record<string, unknown>;
  return (
    o.name === 'EmulationResolutionError' &&
    typeof o.code === 'string' &&
    typeof o.message === 'string'
  );
}

function publicRelationalSummary(
  chain: NonNullable<
    Awaited<ReturnType<typeof runEmulation>>['relationalChain']
  >
) {
  return {
    qrCodeId: chain.qrCodeId,
    visitorQrId: chain.visitorQrId,
    scanLogsCreated: chain.scanLogsCreated,
    chainDepth: chain.chainDepth,
  };
}

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

  const parsed = EmulateTrafficBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // skip-organization-check (Admin Management)
  let targetOrgIds = [data.organizationId];
  if (data.globalMode) {
    const allOrgs = await prisma.organization.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    targetOrgIds = allOrgs.map((o: any) => o.id);
  }

  const secret = process.env.QR_SIGNING_SECRET ?? '';
  if (!data.dryRun && (!secret || secret.length < 32)) {
    return NextResponse.json(
      { error: 'Server misconfiguration: QR_SIGNING_SECRET not set' },
      { status: 500 }
    );
  }

  const results: any[] = [];

  for (const orgId of targetOrgIds) {
    const auditBase = {
      organizationId: orgId,
      userId: actorId,
      actionType: 'EMULATE_TRAFFIC',
      prompt: `GateFlow advanced seeding emulation (traffic) via Admin Dashboard [${data.globalMode ? 'GLOBAL' : 'SINGLE'}]`,
      intentJson: {
        scenario: data.scenario,
        pastDays: data.pastDays,
        totalScans: data.totalScans,
        dryRun: data.dryRun,
        global: data.globalMode,
      } as const,
    };

    try {
      const result = await runEmulation({
        db: prisma as unknown as PrismaClient,
        organizationId: orgId,
        scenario: data.scenario as any,
        pastDays: data.pastDays,
        totalScans: data.totalScans,
        incidentRate: data.incidentRate,
        randomSeed: data.randomSeed,
        dryRun: data.dryRun,
        signingSecret: secret,
        projectId: data.projectId,
        gateId: data.gateId,
        unitId: data.unitId,
        contactId: data.contactId,
        createdByUserId: data.createdByUserId,
        ranges: data.ranges,
        unitIdFormat: data.unitIdFormat as any,
      });

      const metadata = {
        scenario: result.scenario,
        targetOrganizationId: result.organizationId,
        projectId: result.projectId,
        gateId: result.gateId,
        unitId: result.unitId,
        contactId: result.contactId,
        createdByUserId: result.createdByUserId,
        totalScans: result.totalScans,
        dryRun: result.dryRun,
        windowStartIso: result.windowStartIso,
        windowEndIso: result.windowEndIso,
        relationalChain: result.relationalChain
          ? publicRelationalSummary(result.relationalChain)
          : undefined,
      };

      // skip-organization-check (Admin Audit Log)
      await prisma.aiActionLog.create({
        data: {
          ...auditBase,
          status: AiActionStatus.EXECUTED,
          result: result.dryRun ? 'dry_run_ok' : 'emulation_completed',
          metadata,
        },
      });

      results.push({
        success: true,
        data: {
          ...result,
          relationalChain: result.relationalChain
            ? publicRelationalSummary(result.relationalChain)
            : undefined,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[emulate-traffic] Failed for ${orgId}:`, err);

      // skip-organization-check (Admin Audit Log)
      await prisma.aiActionLog.create({
        data: {
          ...auditBase,
          status: AiActionStatus.FAILED,
          result: isEmulationResolutionError(err)
            ? 'resolution_failed'
            : 'emulation_failed',
          metadata: {
            message:
              message.length > 500 ? `${message.slice(0, 500)}…` : message,
            code: isEmulationResolutionError(err) ? err.code : undefined,
          },
        },
      });

      results.push({
        success: false,
        organizationId: orgId,
        error: message,
        code: isEmulationResolutionError(err) ? err.code : undefined,
      });
    }
  }

  return NextResponse.json({
    success: results.every((r) => r.success),
    batchResults: results,
  });
}
