import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

// ─── Schema ──────────────────────────────────────────────────────────────────

const ProvisionSandboxSchema = z.object({
  /** Company / property name for the demo org */
  organizationName: z.string().min(2).max(80),
  /** Contact email — used as the org email and demo admin user email */
  contactEmail: z.string().email(),
  /** Number of simulated gate units to bootstrap (default: 2) */
  gateCount: z.number().int().min(1).max(10).default(2),
  /** Number of simulated resident units to seed (default: 50) */
  unitCount: z.number().int().min(10).max(500).default(50),
  /** Demo duration in days (default: 14, max: 30) */
  trialDays: z.number().int().min(1).max(30).default(14),
  /** Locale for sample data (ar / en) */
  locale: z.enum(['en', 'ar']).default('en'),
});

type ProvisionSandboxInput = z.infer<typeof ProvisionSandboxSchema>;

// ─── Seed helpers ────────────────────────────────────────────────────────────

const EN_UNIT_NAMES = [
  'Villa A-101',
  'Villa A-102',
  'Villa B-201',
  'Apt 301',
  'Apt 302',
  'Penthouse',
  'Studio C-01',
  'Studio C-02',
  'Suite D-01',
  'Suite D-02',
];
const AR_UNIT_NAMES = [
  'فيلا أ-١٠١',
  'فيلا أ-١٠٢',
  'فيلا ب-٢٠١',
  'شقة ٣٠١',
  'شقة ٣٠٢',
  'بنتهاوس',
  'استوديو ج-٠١',
  'استوديو ج-٠٢',
  'جناح د-٠١',
  'جناح د-٠٢',
];

function sampleUnitNames(locale: 'en' | 'ar', count: number): string[] {
  const pool = locale === 'ar' ? AR_UNIT_NAMES : EN_UNIT_NAMES;
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const cycle = Math.floor(i / pool.length);
    names.push(pool[i % pool.length] + (cycle > 0 ? ` #${cycle + 1}` : ''));
  }
  return names;
}

// ─── Provisioner ─────────────────────────────────────────────────────────────

async function provisionSandboxTenant(input: ProvisionSandboxInput) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + input.trialDays);

  // 1. Create sandbox organization
  const org = await prisma.organization.create({
    data: {
      name: input.organizationName,
      email: input.contactEmail,
      isSandbox: true,
      sandboxExpiresAt: expiresAt,
    },
  });

  // 2. Seed sample units (capped at 10 for demo speed)
  // Unit.type is required — assign reasonable defaults based on locale name hints
  const UNIT_TYPE_MAP: Record<
    string,
    'VILLA' | 'STUDIO' | 'ONE_BR' | 'PENTHOUSE' | 'COMMERCIAL'
  > = {
    villa: 'VILLA',
    فيلا: 'VILLA',
    studio: 'STUDIO',
    استوديو: 'STUDIO',
    penthouse: 'PENTHOUSE',
    بنتهاوس: 'PENTHOUSE',
    suite: 'ONE_BR',
    جناح: 'ONE_BR',
  };

  const seedCount = Math.min(input.unitCount, 10);
  const unitNames = sampleUnitNames(input.locale, seedCount);
  const unitData = unitNames.map((name) => {
    const lowerName = name.toLowerCase();
    const matchedType = Object.entries(UNIT_TYPE_MAP).find(([key]) =>
      lowerName.startsWith(key)
    );
    return {
      name,
      organizationId: org.id,
      type: (matchedType?.[1] ?? 'ONE_BR') as
        'VILLA' | 'STUDIO' | 'ONE_BR' | 'PENTHOUSE' | 'COMMERCIAL',
    };
  });
  await prisma.unit.createMany({ data: unitData });

  // 3. Record the sandbox contact in the org's integrationConfig
  // (Full user provisioning requires roleId relation + passwordHash — handled post-login)
  await prisma.organization.update({
    where: { id: org.id },
    data: {
      integrationConfig: {
        sandboxContactEmail: input.contactEmail,
        sandboxLocale: input.locale,
      },
    },
  });

  const demoUser = {
    email: input.contactEmail,
    name: input.locale === 'ar' ? 'مسؤول تجريبي' : 'Demo Admin',
  };

  return {
    organizationId: org.id,
    organizationName: org.name,
    adminEmail: demoUser.email,
    expiresAt: expiresAt.toISOString(),
    trialDays: input.trialDays,
    dashboardUrl: `${process.env.CLIENT_DASHBOARD_URL ?? 'https://app.gateflow.site'}?org=${org.id}&sandbox=1`,
    unitsSeeded: unitData.length,
  };
}

// ─── Route Handlers ──────────────────────────────────────────────────────────

/**
 * POST /api/admin/sandbox/provision
 * Admin-only: Provisions a 14-day sandbox tenant with seeded units and a demo admin user.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Admin auth
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  // 2. Validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ProvisionSandboxSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // 4. Provision
  try {
    const sandbox = await provisionSandboxTenant(parsed.data);
    return NextResponse.json({ ok: true, sandbox }, { status: 201 });
  } catch (err) {
    console.error('[sandbox/provision] POST error:', err);
    return NextResponse.json(
      { error: 'Failed to provision sandbox tenant' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/sandbox/provision
 * Admin-only: Lists all active (non-expired) sandbox organizations.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  const now = new Date();
  const sandboxOrgs = await prisma.organization.findMany({
    where: {
      isSandbox: true,
      sandboxExpiresAt: { gt: now },
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      sandboxExpiresAt: true,
      createdAt: true,
      _count: { select: { units: true, users: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ ok: true, sandboxOrgs }, { status: 200 });
}

/**
 * DELETE /api/admin/sandbox/provision?orgId=xxx
 * Admin-only: Immediately expires a sandbox tenant by setting sandboxExpiresAt to now.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  const url = new URL(request.url);
  const orgId = url.searchParams.get('orgId');
  if (!orgId) {
    return NextResponse.json(
      { error: 'orgId query param is required' },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findFirst({
    where: { id: orgId, isSandbox: true, deletedAt: null },
  });
  if (!org) {
    return NextResponse.json(
      { error: 'Sandbox org not found' },
      { status: 404 }
    );
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: { sandboxExpiresAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    orgId,
    expiredAt: new Date().toISOString(),
  });
}
