import { NextRequest, NextResponse } from 'next/server';
import { prisma, EventType, IncidentStatus } from '@gate-access/db';
import crypto from 'crypto';
import {
  PerimeterEventType,
  PerimeterWebhookPayload,
} from '@/lib/types/perimeter';

/**
 * POST /api/perimeter/webhook
 *
 * Ingest real-time visual AI events (Tailgating, LPR, Forced Entry).
 *
 * security: HMAC Signature Verification (SHA-256)
 * logic: Cross-reference barrier vs scan-log timings to detect anomalies.
 */

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PerimeterWebhookPayload;
    const signature = req.headers.get('x-gf-signature');
    const timestamp = req.headers.get('x-gf-timestamp');

    // 1. Basic Validation
    if (!body.organizationId || !body.gateId || !body.type) {
      return NextResponse.json(
        { success: false, message: 'Malfront payload' },
        { status: 400 }
      );
    }

    // 2. HMAC Security (Optional in Dev, Mandatory in Prod)
    // For now, we'll implement the logic assuming the signature is present.
    const secret = process.env.PERIMETER_WEBHOOK_SECRET || 'dev-secret';
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${JSON.stringify(body)}`)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { success: false, message: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 3. Logic: Detect Tailgating or Intrusion
    if (
      body.type === PerimeterEventType.TAILGATING ||
      body.type === PerimeterEventType.BARRIER_FORCED
    ) {
      // Cross-reference with last 5s of scan logs
      const fiveSecondsAgo = new Date(Date.now() - 5000);
      const recentValidScan = await prisma.scanLog.findFirst({
        where: {
          gateId: body.gateId,
          scannedAt: { gte: fiveSecondsAgo },
          status: 'SUCCESS',
        },
      });

      // If tailgating detected and no recent success scan, create an Incident
      if (!recentValidScan || body.type === PerimeterEventType.BARRIER_FORCED) {
        const incident = await prisma.incident.create({
          data: {
            organizationId: body.organizationId,
            gateId: body.gateId,
            reason:
              body.type === PerimeterEventType.BARRIER_FORCED
                ? 'BARRIER_FORCED: Sudden force detected without scan.'
                : 'TAILGATING: Vehicle entered without active scan.',
            status: IncidentStatus.UNDER_REVIEW,
            notes: `Detection from AI Camera at ${body.timestamp}. Metadata: ${JSON.stringify(body.payload)}`,
          },
        });

        // 4. Record to EventLog to trigger real-time SSE stream in Dashboard
        await prisma.eventLog.create({
          data: {
            organizationId: body.organizationId,
            type: EventType.WATCHLIST_ALERT, // We'll reuse Alert or add a generic INCIDENT_CREATED if needed
            payload: {
              incidentId: incident.id,
              gateId: body.gateId,
              severity: 'CRITICAL',
              reason: incident.reason,
            },
          },
        });
      }
    }

    // 5. Generic Event Logging for analytics
    await prisma.eventLog.create({
      data: {
        organizationId: body.organizationId,
        type: EventType.SCAN_RECORDED, // Generic perimeter entry
        payload: {
          type: body.type,
          gateId: body.gateId,
          ...body.payload,
        },
      },
    });

    return NextResponse.json({ success: true, message: 'Event ingested' });
  } catch (error) {
    console.error('[perimeter/webhook] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    );
  }
}
