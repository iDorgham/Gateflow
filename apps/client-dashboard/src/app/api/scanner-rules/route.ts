import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const ScannerConfigSchema = z.object({
  offlineModeEnabled: z.boolean(),
  vibrationEnabled: z.boolean(),
  soundEnabled: z.boolean(),
  allowSupervisorOverride: z.boolean(),
});

/** GET /api/scanner-rules — fetch org scanner config */
export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { scannerConfig: true },
  });

  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  return NextResponse.json({ config: org.scannerConfig ?? null });
}

/** PUT /api/scanner-rules — update org scanner config */
export async function PUT(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Require gates:manage or workspace-level permission
  if (!claims.permissions?.['gates:manage'] && !claims.permissions?.['workspace:manage']) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = ScannerConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.organization.update({
    where: { id: claims.orgId },
    data: { scannerConfig: parsed.data },
  });

  revalidatePath('/dashboard/settings/gates');
  return NextResponse.json({ config: parsed.data });
}
