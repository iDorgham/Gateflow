import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { revalidatePath } from 'next/cache';
import { NotificationConfigSchema, DEFAULT_NOTIFICATION_CONFIG } from '@/lib/notifications/types';

export const dynamic = 'force-dynamic';

/** GET /api/notification-prefs */
export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { notificationConfig: true },
  });

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ config: org.notificationConfig ?? DEFAULT_NOTIFICATION_CONFIG });
}

/** PUT /api/notification-prefs */
export async function PUT(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = NotificationConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.organization.update({
    where: { id: claims.orgId },
    data: { notificationConfig: parsed.data },
  });

  revalidatePath('/dashboard/settings/notifications');
  return NextResponse.json({ config: parsed.data });
}
