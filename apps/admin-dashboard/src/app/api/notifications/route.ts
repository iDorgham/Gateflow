import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Notification API
 * GET /api/notifications?userId=...&orgId=...
 */
export async function GET(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  const userId = searchParams.get('userId');

  if (!orgId || !userId) {
    return NextResponse.json(
      { error: 'Missing orgId or userId' },
      { status: 400 }
    );
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { organizationId: orgId, userId, status: 'UNREAD' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
