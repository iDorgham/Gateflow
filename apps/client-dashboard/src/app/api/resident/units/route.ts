import { NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const units = await prisma.unit.findMany({
      where: {
        userId: claims.sub,
        deletedAt: null,
      },
      include: {
        project: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: units,
    });
  } catch (error) {
    console.error('GET /api/resident/units error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
