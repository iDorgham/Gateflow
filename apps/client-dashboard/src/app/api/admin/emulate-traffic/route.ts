/**
 * ## POST /api/admin/emulate-traffic
 *
 * **Auth:** Session JWT (cookie or `Authorization: Bearer`) — **Super Admin** only.
 *
 * **CSRF:** `x-csrf-token` header must match `gf_csrf_token` cookie (same as other dashboard mutations).
 *
 * **Rate limit:** 5 requests per hour per authenticated user id (`checkRateLimit` / Upstash when configured).
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
 *
 * **Audit:** `AiActionLog` row per request with **target** `organizationId` (tenant context for the run),
 * `userId` = acting Super Admin. Metadata holds scenario, counts, ids — **no** signing secrets or full QR strings.
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
import { getSessionClaims } from '@/lib/auth-cookies';
import { validateCsrfToken } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { isSuperAdmin } from '@/lib/super-admin';

export const dynamic = 'force-dynamic';

const EMULATE_RATE_MAX = 5;
const EMULATE_RATE_WINDOW_MS = 60 * 60 * 1000;

const ScenarioEnum = z.enum(RUSH_SCENARIOS);

const EmulateTrafficBodySchema = z.object({
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

function isEmulationResolutionError(
  err: unknown
): err is { code: string; message: string } {
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
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSuperAdmin(claims)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!(await validateCsrfToken(request))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const rl = await checkRateLimit(
    `emulate-traffic:${claims.sub}`,
    EMULATE_RATE_MAX,
    EMULATE_RATE_WINDOW_MS
  );
  if (!rl.allowed) {
    const retrySec = Math.ceil(rl.retryAfterMs / 1000);
    return NextResponse.json(
      { error: 'Too many emulation requests', retryAfterMs: rl.retryAfterMs },
      {
        status: 429,
        headers:
          retrySec > 0 ? { 'Retry-After': String(retrySec) } : undefined,
      }
    );
  }

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

  const secret = process.env.QR_SIGNING_SECRET ?? '';
  if (!data.dryRun && (!secret || secret.length < 32)) {
    return NextResponse.json(
      { error: 'Server misconfiguration: QR_SIGNING_SECRET not set' },
      { status: 500 }
    );
  }

  const auditBase = {
    organizationId: data.organizationId,
    userId: claims.sub,
    actionType: 'EMULATE_TRAFFIC',
    prompt: 'GateFlow advanced seeding emulation (traffic)',
    intentJson: {
      scenario: data.scenario,
      pastDays: data.pastDays,
      totalScans: data.totalScans,
      dryRun: data.dryRun,
    } as const,
  };

  try {
    const result = await runEmulation({
      db: prisma as unknown as PrismaClient,
      organizationId: data.organizationId,
      scenario: data.scenario,
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

    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.EXECUTED,
        result: result.dryRun ? 'dry_run_ok' : 'emulation_completed',
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        relationalChain: result.relationalChain
          ? publicRelationalSummary(result.relationalChain)
          : undefined,
      },
    });
  } catch (err) {
    if (isEmulationResolutionError(err)) {
      await prisma.aiActionLog.create({
        data: {
          ...auditBase,
          status: AiActionStatus.FAILED,
          result: 'resolution_failed',
          metadata: {
            errorCode: err.code,
            message: err.message,
          },
        },
      });
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    await prisma.aiActionLog.create({
      data: {
        ...auditBase,
        status: AiActionStatus.FAILED,
        result: 'emulation_failed',
        metadata: {
          message:
            message.length > 500 ? `${message.slice(0, 500)}…` : message,
        },
      },
    });
    console.error('[emulate-traffic]', err);
    return NextResponse.json({ error: 'Emulation failed' }, { status: 500 });
  }
}
