/**
 * ## GET /api/admin/emulation-history
 *
 * **Auth:** Admin Session Cookie — **Internal Admin** only.
 *
 * **Query Params:**
 * - `organizationId` (string, required)
 * - `limit` (int, default 50)
 *
 * **Returns:**
 * - List of `AiActionLog` entries filtered for `EMULATE_TRAFFIC` and `SEED_HIERARCHY`.
 */

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

  if (!organizationId) {
    return NextResponse.json(
      { error: 'organizationId is required' },
      { status: 400 }
    );
  }

  try {
    // skip-organization-check (Admin Management)
    const logs = await prisma.aiActionLog.findMany({
      where: {
        organizationId,
        actionType: {
          in: ['EMULATE_TRAFFIC', 'SEED_HIERARCHY'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    console.error('[emulation-history]', err);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
