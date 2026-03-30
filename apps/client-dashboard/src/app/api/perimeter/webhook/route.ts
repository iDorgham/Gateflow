import { NextRequest, NextResponse } from 'next/server';
import { prisma, EventType, IncidentStatus } from '@gate-access/db';
import crypto from 'crypto';
import { z } from 'zod';
import {
  PerimeterEventType,
  PerimeterWebhookPayload,
} from '@/lib/types/perimeter';

/**
 * POST /api/perimeter/webhook
 *
 * Ingest real-time visual AI events (Tailgating, LPR, Forced Entry).
 *
 * Security: HMAC-SHA256 fail-closed — missing secret or invalid signature → 401.
 * Multi-tenancy: all DB reads/writes are scoped to webhook `organizationId`.
 * Idempotency: duplicate incidents within a 10-second window are suppressed.
 */

/** HMAC signing format: `${timestamp}.${rawBody}` (same as sender convention). */
function computeHmac(
  secret: string,
  timestamp: string,
  rawBody: string
): Buffer {
  return Buffer.from(
    crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex'),
    'hex'
  );
}

const PerimeterWebhookSchema = z.object({
  organizationId: z.string().min(1),
  projectId: z.string().min(1),
  gateId: z.string().min(1),
  type: z.nativeEnum(PerimeterEventType),
  payload: z.record(z.any()),
  timestamp: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // ── 1. Read raw body (needed for correct HMAC computation) ─────────────────
  let rawBody: string;
  let bodyUnknown: unknown;
  try {
    rawBody = await req.text();
    bodyUnknown = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // ── 2. Payload validation (Zod) ─────────────────────────────────────────────
  const parsed = PerimeterWebhookSchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Malformed payload',
        error: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  // Zod guarantees shape; we still cast to the shared TS interface.
  const body = parsed.data as PerimeterWebhookPayload;

  // ── 3. Fail-closed HMAC verification ──────────────────────────────────────
  // No dev fallback — if the secret is absent, the endpoint refuses all requests.
  const secret = process.env.PERIMETER_WEBHOOK_SECRET;
  if (!secret) {
    console.error(
      '[perimeter/webhook] PERIMETER_WEBHOOK_SECRET is not configured'
    );
    return NextResponse.json(
      { success: false, message: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('x-gf-signature');
  const timestamp = req.headers.get('x-gf-timestamp');

  if (!signature || !timestamp) {
    return NextResponse.json(
      { success: false, message: 'Missing signature headers' },
      { status: 401 }
    );
  }

  const expectedBuf = computeHmac(secret, timestamp, rawBody);
  let sigBuf: Buffer;
  try {
    sigBuf = Buffer.from(signature, 'hex');
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid signature encoding' },
      { status: 401 }
    );
  }

  // timingSafeEqual requires equal-length buffers — a length mismatch is itself
  // an invalid signature so we can safely short-circuit here.
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    // ── 4. Detect anomalies: Tailgating or Forced Entry ─────────────────────
    if (
      body.type === PerimeterEventType.TAILGATING ||
      body.type === PerimeterEventType.LPR_MATCH ||
      body.type === PerimeterEventType.BARRIER_FORCED
    ) {
      const fiveSecondsAgo = new Date(Date.now() - 5_000);

      // Org-scoped scan cross-reference: filter via qrCode.organizationId so
      // a gateId from another tenant cannot satisfy this check.
      const recentValidScan = await prisma.scanLog.findFirst({
        where: {
          gateId: body.gateId,
          scannedAt: { gte: fiveSecondsAgo },
          status: 'SUCCESS',
          qrCode: { organizationId: body.organizationId },
        },
      });

      const isAnomaly =
        body.type === PerimeterEventType.BARRIER_FORCED ||
        (body.type === PerimeterEventType.TAILGATING && !recentValidScan) ||
        body.type === PerimeterEventType.LPR_MATCH;

      if (isAnomaly) {
        // ── 5. Idempotency guard ─────────────────────────────────────────────
        // Suppress duplicate incidents for the same gate + type within 10 seconds.
        const tenSecondsAgo = new Date(Date.now() - 10_000);
        const existingIncident = await prisma.incident.findFirst({
          where: {
            organizationId: body.organizationId,
            gateId: body.gateId,
            reason: { startsWith: `${body.type}:` },
            createdAt: { gte: tenSecondsAgo },
          },
          select: { id: true },
        });

        if (!existingIncident) {
          const reason =
            body.type === PerimeterEventType.BARRIER_FORCED
              ? `${body.type}: Sudden force detected without authorised scan.`
              : body.type === PerimeterEventType.TAILGATING
                ? `${body.type}: Vehicle entered without an active scan.`
                : `${body.type}: Licence plate flagged by perimeter camera.`;

          // Attempt to link the triggering scan when available
          const triggeringScan = recentValidScan ?? null;

          const incident = await prisma.incident.create({
            data: {
              organizationId: body.organizationId,
              gateId: body.gateId,
              reason,
              status: IncidentStatus.UNDER_REVIEW,
              notes: `AI camera detection at ${body.timestamp}. Metadata: ${JSON.stringify(body.payload)}`,
              ...(triggeringScan ? { scanLogId: triggeringScan.id } : {}),
            },
          });

          // ── 6. Emit SSE alert via EventLog ──────────────────────────────────
          await prisma.eventLog.create({
            data: {
              organizationId: body.organizationId,
              type: EventType.WATCHLIST_ALERT,
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
    }

    // ── 7. Generic analytics event log ──────────────────────────────────────
    await prisma.eventLog.create({
      data: {
        organizationId: body.organizationId,
        type: EventType.SCAN_RECORDED,
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
