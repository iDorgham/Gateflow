import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  const limit = parseInt(searchParams.get('limit') ?? '50', 10);

  try {
    const logs = await prisma.aiActionLog.findMany({
      where: {
        AND: [
          { organizationId: organizationId || undefined },
          {
            OR: [
              { actionType: 'EMULATE_TRAFFIC' },
              { actionType: 'SEED_HIERARCHY' },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      select: {
        id: true,
        organizationId: true,
        actionType: true,
        status: true,
        result: true,
        metadata: true,
        createdAt: true,
        intentJson: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[emulation-history] Failed:`, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
