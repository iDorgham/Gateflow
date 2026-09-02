/**
 * GET/PUT /api/security/ip-allowlist
 * Org-scoped tenant IP allow-list management. Persisted under the org's
 * `scannerConfig.security.ipAllowlist` (no schema migration required) and
 * consumed at runtime by the per-tenant/IP access enforcer.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { validateAllowListInput } from '@/lib/enforce-tenant-access';

export const dynamic = 'force-dynamic';

/** GET /api/security/ip-allowlist — fetch the org's allow-list. */
export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { scannerConfig: true },
  });
  const config = org?.scannerConfig as
    { security?: { ipAllowlist?: unknown } } | null | undefined;
  const raw = config?.security?.ipAllowlist;
  const normalized = validateAllowListInput(raw);
  return NextResponse.json({
    allowList: normalized.valid ? normalized.entries : [],
  });
}

/** PUT /api/security/ip-allowlist — replace the org's allow-list. */
export async function PUT(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!claims.permissions?.['workspace:manage']) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = validateAllowListInput(body?.allowList);
  if (!parsed.valid) {
    return NextResponse.json(
      { error: 'Invalid allow list', details: parsed.errors },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId },
    select: { scannerConfig: true },
  });
  const existing =
    (
      (org?.scannerConfig as { security?: { ipAllowlist?: unknown } } | null) ??
      {}
    ).security ?? {};
  const next = {
    ...((org?.scannerConfig as Record<string, unknown> | null) ?? {}),
    security: { ...existing, ipAllowlist: parsed.entries },
  } as Prisma.InputJsonObject;

  await prisma.organization.update({
    where: { id: claims.orgId },
    data: { scannerConfig: next },
  });

  return NextResponse.json({ allowList: parsed.entries });
}
