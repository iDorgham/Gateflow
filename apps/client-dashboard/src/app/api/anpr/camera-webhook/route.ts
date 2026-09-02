import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { decrypt, prisma } from '@gate-access/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';
import { normalizePlate } from '../stream-event/route';

/**
 * Common camera webhook adapter payload schema:
 * Standardizes vendor camera payloads (Hikvision, Dahua, Axis, Milesight).
 */
interface CameraWebhookBody {
  plate?: string;
  license_plate?: string;
  plateNumber?: string;
  gate_id?: string;
  gateId?: string;
  camera_ip?: string;
  cameraIp?: string;
  confidence?: number;
  picture_url?: string;
  snapshotUrl?: string;
  api_key?: string;
  apiKey?: string;
}

function verifyApiKey(candidate: string, encryptedKey: string): boolean {
  let expected: string;
  try {
    expected = decrypt(encryptedKey);
  } catch {
    return false;
  }
  const candidateBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  return (
    candidateBytes.length === expectedBytes.length &&
    timingSafeEqual(candidateBytes, expectedBytes)
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const urlKey = url.searchParams.get('key');
    const headerKey =
      request.headers.get('x-anpr-api-key') || request.headers.get('x-api-key');

    let body: CameraWebhookBody = {};
    try {
      body = (await request.json()) as CameraWebhookBody;
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const apiKey = urlKey || headerKey || body.api_key || body.apiKey;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: missing camera API key' },
        { status: 401 }
      );
    }

    // Extract raw plate and gateId across vendor payload shapes
    const rawPlate = body.plate || body.license_plate || body.plateNumber;
    const gateId =
      body.gate_id || body.gateId || request.nextUrl.searchParams.get('gateId');

    if (!rawPlate || !gateId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing plate number or gate ID in camera webhook',
        },
        { status: 400 }
      );
    }

    const normalized = normalizePlate(rawPlate);

    // Resolve gate and org context
    const gate = await prisma.gate.findFirst({
      where: { id: gateId, deletedAt: null },
      select: { id: true, name: true, organizationId: true },
    });

    if (!gate) {
      return NextResponse.json(
        { success: false, message: 'Gate not found' },
        { status: 404 }
      );
    }

    const credential = await prisma.integrationCredential.findFirst({
      where: {
        organizationId: gate.organizationId,
        provider: 'ANPR_CAMERA',
        deletedAt: null,
      },
      select: { encryptedKey: true },
    });
    if (!credential || !verifyApiKey(apiKey, credential.encryptedKey)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: invalid camera API key' },
        { status: 401 }
      );
    }

    // Rate limit: 120 ANPR webhook calls per minute per gate
    const rl = await checkRateLimit(`anpr-cam:${gate.id}`, 120, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Match vehicle in organization DB
    const vehicle = await prisma.vehiclePlate.findFirst({
      where: {
        organizationId: gate.organizationId,
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
      void emitEvent(gate.organizationId, EventType.WATCHLIST_ALERT, {
        severity: 'UNRECOGNIZED_PLATE',
        gateId: gate.id,
        plateNumber: rawPlate,
        normalized,
        cameraIp: body.camera_ip || body.cameraIp,
      });

      return NextResponse.json(
        {
          success: false,
          granted: false,
          reason: 'unregistered_plate',
          message: `Plate ${rawPlate} not authorized at ${gate.name}`,
        },
        { status: 403 }
      );
    }

    // Barrier Trip Signal & Event Output
    const tripSignal = {
      action: 'OPEN_BARRIER',
      gateId: gate.id,
      gateName: gate.name,
      vehicleId: vehicle.id,
      plateNumber: rawPlate,
      ownerName:
        vehicle.ownerName ||
        `${vehicle.contact?.firstName ?? ''} ${vehicle.contact?.lastName ?? ''}`.trim(),
      unitName: vehicle.unit?.name ?? null,
      confidence: body.confidence ?? 0.95,
      timestamp: new Date().toISOString(),
    };

    void emitEvent(gate.organizationId, EventType.SCAN_RECORDED, tripSignal);

    return NextResponse.json(
      {
        success: true,
        granted: true,
        message: `Barrier trip signal sent for plate ${rawPlate}`,
        tripSignal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Camera Webhook API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
