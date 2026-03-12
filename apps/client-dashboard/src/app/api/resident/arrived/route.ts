import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/resident/arrived
 *
 * Called when a guest taps "I've arrived" on the QR landing page.
 * No auth required — the visitorQRId is sufficient access control.
 *
 * Idempotency: only one arrival push per scan event (arrivalNotifiedAt on ScanLog).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const { visitorQRId } = (body ?? {}) as { visitorQRId?: string };
    if (!visitorQRId) {
      return NextResponse.json({ success: false, message: 'visitorQRId is required' }, { status: 400 });
    }

    const visitorQR = await prisma.visitorQR.findUnique({
      where: { id: visitorQRId },
      include: {
        qrCode: { select: { id: true } },
        unit: { select: { user: { select: { id: true, preferences: true } } } },
      },
    });

    if (!visitorQR) {
      return NextResponse.json({ success: false, message: 'Visitor QR not found' }, { status: 404 });
    }

    const resident = visitorQR.unit?.user;
    if (!resident) {
      return NextResponse.json({ success: false, message: 'Resident not found' }, { status: 404 });
    }

    // Idempotency: find most recent SUCCESS scan for this QR
    const latestScan = await prisma.scanLog.findFirst({
      where: { qrCodeId: visitorQR.qrCode.id, status: 'SUCCESS' },
      orderBy: { scannedAt: 'desc' },
    });

    if (!latestScan) {
      return NextResponse.json(
        { success: false, message: 'No successful scan found — gate scan required first' },
        { status: 409 }
      );
    }

    if (latestScan.arrivalNotifiedAt !== null) {
      return NextResponse.json({ success: false, error: 'already_notified' }, { status: 409 });
    }

    // Mark scan log with arrival time
    await prisma.scanLog.update({
      where: { id: latestScan.id },
      data: { arrivalNotifiedAt: new Date() },
    });

    // Send Expo push to resident if token available
    const prefs = (resident.preferences ?? {}) as Record<string, unknown>;
    const expoPushToken = typeof prefs.expoPushToken === 'string' ? prefs.expoPushToken : null;

    if (expoPushToken) {
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
      }).catch(() => {}).finally(() => clearTimeout(timeout));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/resident/arrived error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
