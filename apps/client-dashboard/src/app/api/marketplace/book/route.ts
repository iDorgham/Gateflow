import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, ServiceBookingStatus } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

const BookServiceSchema = z.object({
  serviceId: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId || !claims?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  let bodyUnknown: unknown;
  try {
    bodyUnknown = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const parsed = BookServiceSchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        error: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { serviceId } = parsed.data;
  const orgId = claims.orgId;
  const userId = claims.sub;

  try {
    // Resident can book for their first active unit (v0.1 MVP).
    const unit = await prisma.unit.findFirst({
      where: { userId, organizationId: orgId, deletedAt: null, isActive: true },
      select: { id: true },
    });

    if (!unit) {
      return NextResponse.json(
        { success: false, message: 'Unit not found' },
        { status: 404 }
      );
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId: orgId,
        deletedAt: null,
        isActive: true,
        merchant: { deletedAt: null, isActive: true },
      },
      select: {
        id: true,
        priceCents: true,
        currency: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    const booking = await prisma.serviceBooking.create({
      data: {
        organizationId: orgId,
        serviceId: service.id,
        unitId: unit.id,
        userId,
        status: ServiceBookingStatus.PAID,
        priceCents: service.priceCents,
        currency: service.currency,
      },
      select: {
        id: true,
        status: true,
        priceCents: true,
        currency: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('[marketplace/book] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
