import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { checkAndConsumeQuota } from '@gate-access/db/quota';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let unitId = searchParams.get('unitId');

    if (!unitId) {
      // Find the first unit for this resident
      const unit = await prisma.unit.findFirst({
        where: { userId: claims.sub, deletedAt: null },
      });
      
      if (!unit) {
        return NextResponse.json({ success: false, message: 'No unit found for resident' }, { status: 404 });
      }
      unitId = unit.id;
    } else {
      // Verify the unit belongs to the resident
      const unit = await prisma.unit.findFirst({
        where: { id: unitId, userId: claims.sub, deletedAt: null },
      });
      
      if (!unit) {
        return NextResponse.json({ success: false, message: 'Unit not found or unauthorized' }, { status: 403 });
      }
    }

    const quotaStatus = await checkAndConsumeQuota(unitId);

    return NextResponse.json({
      success: true,
      data: quotaStatus,
    });
  } catch (error) {
    console.error('GET /api/resident/quota error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
