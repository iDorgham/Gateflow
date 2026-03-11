import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const IntegrationConfigSchema = z.object({
  gtmId: z.string().max(30).optional().nullable(),
  googleAnalyticsId: z.string().max(50).optional().nullable(),
  hubspotPortalId: z.string().max(20).optional().nullable(),
  facebookPixelId: z.string().max(30).optional().nullable(),
  customDomain: z.string().max(200).optional().nullable(),
});

/** GET /api/integrations */
export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { integrationConfig: true, domain: true },
  });

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ config: org.integrationConfig ?? {}, domain: org.domain });
}

/** PUT /api/integrations */
export async function PUT(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = IntegrationConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  // Strip nulls so we store clean JSON
  const config: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v) config[k] = v;
  }

  await prisma.organization.update({
    where: { id: claims.orgId },
    data: { integrationConfig: config },
  });

  revalidatePath('/dashboard/settings/integrations');
  return NextResponse.json({ config });
}
