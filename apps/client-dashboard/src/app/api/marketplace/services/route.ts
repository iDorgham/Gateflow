import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const orgId = claims.orgId;

  try {
    const services = await prisma.service.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        isActive: true,
        merchant: {
          deletedAt: null,
          isActive: true,
        },
      },
      include: {
        merchant: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? null,
        category: s.category ?? null,
        priceCents: s.priceCents,
        currency: s.currency,
        durationMins: s.durationMins ?? null,
        merchant: { id: s.merchant.id, name: s.merchant.name },
      })),
    });
  } catch (error) {
    console.error('[marketplace/services] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
