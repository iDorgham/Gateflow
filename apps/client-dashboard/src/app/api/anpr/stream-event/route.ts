import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { checkRateLimit } from '@/lib/rate-limit';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

const ANPREventSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  gateId: z.string().min(1, 'Gate ID is required'),
  cameraIp: z.string().optional(),
  confidence: z.number().min(0).max(1).optional().default(0.95),
  snapshotUrl: z.string().url().optional(),
  timestamp: z.string().optional(),
});

export function normalizePlate(plate: string): string {
  // Normalize by upper-casing and stripping whitespace/dashes/special symbols
  return plate.replace(/[\s\-_.:,]/g, '').toUpperCase();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: organization context required',
        },
        { status: 401 }
      );
    }

    const orgId = claims.orgId;

    // Rate limit: 60 ANPR events per minute per gate/user
    const rl = await checkRateLimit(`anpr:${orgId}:${claims.sub}`, 60, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many ANPR stream requests. Rate limit exceeded.',
        },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = ANPREventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ANPR event payload',
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { plateNumber, gateId, cameraIp, confidence, snapshotUrl } =
      validation.data;
    const normalized = normalizePlate(plateNumber);

    // Verify gate belongs to org
    const gate = await prisma.gate.findFirst({
      where: { id: gateId, organizationId: orgId, deletedAt: null },
      select: { id: true, name: true },
    });

    if (!gate) {
      return NextResponse.json(
        { success: false, message: 'Gate not found in organization' },
        { status: 404 }
      );
    }

    // Lookup vehicle plate in organization DB
    const vehicle = await prisma.vehiclePlate.findFirst({
      where: {
        organizationId: orgId,
        normalizedPlate: normalized,
        deletedAt: null,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            watchlistStatus: true,
          },
        },
        unit: { select: { id: true, name: true } },
      },
    });

    if (!vehicle || !vehicle.isActive) {
      // Unrecognized vehicle plate — emit event & return denied response
      void emitEvent(orgId, EventType.WATCHLIST_ALERT, {
        severity: 'UNRECOGNIZED_PLATE',
        gateId: gate.id,
        plateNumber,
        normalized,
        confidence,
        snapshotUrl,
      });

      return NextResponse.json(
        {
          success: false,
          granted: false,
          reason: !vehicle ? 'unregistered_plate' : 'inactive_plate',
          message: !vehicle
            ? `Plate ${plateNumber} is not registered`
            : `Plate ${plateNumber} is deactivated`,
          plateNumber,
        },
        { status: 403 }
      );
    }

    if (vehicle.contact?.watchlistStatus === 'BLOCKED') {
      // Watchlist blocked owner — create incident and deny
      await prisma.incident.create({
        data: {
          organizationId: orgId,
          gateId: gate.id,
          userId: claims.sub,
          reason: 'watchlist_match',
          status: 'UNDER_REVIEW',
          notes: `ANPR scan matched blocked contact ${vehicle.contact.firstName} ${vehicle.contact.lastName} (Plate: ${plateNumber}).`,
        },
      });

      return NextResponse.json(
        {
          success: false,
          granted: false,
          reason: 'blocked_owner',
          message: 'Vehicle owner is on security watchlist',
          plateNumber,
        },
        { status: 403 }
      );
    }

    // Granted — trip barrier & emit real-time barrier open event
    const eventPayload = {
      vehicleId: vehicle.id,
      plateNumber,
      normalized,
      gateId: gate.id,
      gateName: gate.name,
      ownerName:
        vehicle.ownerName ||
        `${vehicle.contact?.firstName ?? ''} ${vehicle.contact?.lastName ?? ''}`.trim() ||
        'Resident',
      unitName: vehicle.unit?.name ?? null,
      cameraIp,
      confidence,
      snapshotUrl,
      barrierAction: 'OPEN',
    };

    void emitEvent(orgId, EventType.SCAN_RECORDED, eventPayload);

    return NextResponse.json(
      {
        success: true,
        granted: true,
        message: `Barrier opened for ${plateNumber}`,
        data: eventPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ANPR API] Stream event error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
