import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { verifyArrivalCapability } from '@/lib/arrival-capability';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
const SCAN_FRESHNESS_MS = 15 * 60_000;

/**
 * POST /api/resident/arrived
 *
 * Called when a guest taps "I've arrived" on the QR landing page.
 * No session required — a short-lived, purpose-bound capability is required.
 *
 * Idempotency: only one arrival push per scan event (arrivalNotifiedAt on ScanLog).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const { capability } = (body ?? {}) as { capability?: string };
    if (
      typeof capability !== 'string' ||
      capability.length === 0 ||
      capability.length > 2048
    ) {
      return NextResponse.json(
        { success: false, message: 'capability is required' },
        { status: 400 }
      );
    }

    const secret = process.env.QR_SIGNING_SECRET ?? '';
    const claims = verifyArrivalCapability(capability, secret);
    if (!claims) {
      return NextResponse.json(
        { success: false, message: 'Invalid capability' },
        { status: 401 }
      );
    }
    const { visitorQRId } = claims;

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip =
      forwardedFor?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimit = await checkRateLimit(
      `resident-arrived:${visitorQRId}:${ip}`,
      5,
      60_000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.max(1, Math.ceil(rateLimit.retryAfterMs / 1000))
            ),
          },
        }
      );
    }

    // skip-organization-check (Unauthenticated public arrival page)
    const visitorQR = await prisma.visitorQR.findUnique({
      where: { id: visitorQRId },
      include: {
        qrCode: { select: { id: true } },
        unit: { select: { user: { select: { id: true, preferences: true } } } },
      },
    });

    if (!visitorQR) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR not found' },
        { status: 404 }
      );
    }

    const resident = visitorQR.unit?.user;
    if (!resident) {
      return NextResponse.json(
        { success: false, message: 'Resident not found' },
        { status: 404 }
      );
    }

    // Idempotency: find most recent SUCCESS scan for this QR
    // skip-organization-check (Sufficiently scoped by QR code ID)
    const scanFreshnessCutoff = new Date(Date.now() - SCAN_FRESHNESS_MS);
    const latestScan = await prisma.scanLog.findFirst({
      where: {
        qrCodeId: visitorQR.qrCode.id,
        status: 'SUCCESS',
        scannedAt: { gte: scanFreshnessCutoff },
      },
      orderBy: { scannedAt: 'desc' },
    });

    if (!latestScan) {
      return NextResponse.json(
        {
          success: false,
          message: 'No successful scan found — gate scan required first',
        },
        { status: 409 }
      );
    }

    if (latestScan.arrivalNotifiedAt !== null) {
      return NextResponse.json(
        { success: false, error: 'already_notified' },
        { status: 409 }
      );
    }

    // Mark scan log with arrival time
    const claim = await prisma.scanLog.updateMany({
      where: {
        id: latestScan.id,
        arrivalNotifiedAt: null,
        scannedAt: { gte: scanFreshnessCutoff },
      },
      data: { arrivalNotifiedAt: new Date() },
    });
    if (claim.count !== 1) {
      return NextResponse.json(
        { success: false, error: 'already_notified' },
        { status: 409 }
      );
    }

    // Send Expo push to resident if token available and preference enabled
    const prefs = (resident.preferences ?? {}) as Record<string, unknown>;
    const expoPushToken =
      typeof prefs.expoPushToken === 'string' ? prefs.expoPushToken : null;
    const notifyArrival = prefs.notifyArrival !== false; // default true

    if (expoPushToken && notifyArrival) {
      const visitorName = visitorQR.visitorName ?? 'Your visitor';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: expoPushToken,
          title: 'Visitor at your door',
          body: `${visitorName} has arrived`,
          data: { type: 'visitor_arrived', visitorQRId },
          sound: 'default',
        }),
        signal: controller.signal,
      })
        .catch(() => {})
        .finally(() => clearTimeout(timeout));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/resident/arrived error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
