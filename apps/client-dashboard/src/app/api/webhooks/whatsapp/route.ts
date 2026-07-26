import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';

import {
  prisma,
  QRCodeType as PrismaQRCodeType,
  AccessRuleType,
} from '@gate-access/db';
import { signQRPayload, QRCodeType } from '@gate-access/types';
import { checkAndConsumeQuota } from '@gate-access/db/quota';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';
import {
  runReplayProtectedWebhook,
  verifyWebhookEnvelope,
} from '@/lib/webhook-replay';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Signed envelope: HMAC-SHA256(`${timestamp}.${eventId}.${rawBody}`), ±5 minutes.
// Durable provider/org/event replay consumption shares the business transaction.

const WhatsAppGuestRegistrationSchema = z.object({
  organizationId: z.string().min(1),
  unitId: z.string().min(1),
  gateId: z.string().min(1).optional(),

  // Guest identity (WhatsApp message content)
  visitorName: z.string().min(1),
  visitorPhone: z.string().optional(),
  visitorEmail: z.string().email().optional(),

  // Desired QR access rule
  type: z
    .enum(['ONETIME', 'DATERANGE', 'RECURRING', 'PERMANENT'])
    .default('ONETIME'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  recurringDays: z.array(z.number().min(0).max(6)).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),

  // For bot replies / future idempotency (not used for DB keys yet)
  fromPhone: z.string().optional(),
  locale: z.enum(['ar', 'en']).default('en').optional(),
});

async function getResidentExpoToken(params: {
  organizationId: string;
  unitId: string;
}): Promise<string | null> {
  const { organizationId, unitId } = params;

  const unit = await prisma.unit.findFirst({
    where: { id: unitId, organizationId, deletedAt: null },
    include: {
      user: {
        select: {
          id: true,
          preferences: true,
        },
      },
    },
  });

  const prefs =
    (unit?.user?.preferences as Record<string, unknown> | null) ?? null;
  const token =
    typeof prefs?.expoPushToken === 'string' ? prefs.expoPushToken : null;
  return token;
}

async function getGateName(params: {
  organizationId: string;
  gateId?: string;
}): Promise<string> {
  const { organizationId, gateId } = params;
  if (!gateId) return 'the gate';

  const gate = await prisma.gate.findFirst({
    where: { id: gateId, organizationId, deletedAt: null },
    select: { name: true },
  });

  return gate?.name ?? 'the gate';
}

async function sendApprovalPushBestEffort(params: {
  expoPushToken: string;
  gateName: string;
  visitorQRId: string;
  visitorName: string;
}) {
  const { expoPushToken, gateName, visitorQRId, visitorName } = params;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: expoPushToken,
        title: 'Visitor approval required',
        body: `${visitorName} requested entry at ${gateName}`,
        data: { type: 'visitor_approval', visitorQRId },
        sound: 'default',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch {
    // Best-effort: never block the webhook response.
  }
}

export async function POST(req: NextRequest) {
  // ── 1. Read raw body (needed for correct HMAC computation) ────────────────
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

  // ── 2. Verify HMAC signature (fail-closed) ────────────────────────────────
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('x-gf-signature');
  const timestamp = req.headers.get('x-gf-timestamp');
  const eventId = req.headers.get('x-gf-event-id');
  if (!signature || !timestamp || !eventId) {
    return NextResponse.json(
      { success: false, message: 'Missing signature headers' },
      { status: 401 }
    );
  }

  if (
    !verifyWebhookEnvelope({
      eventId,
      rawBody,
      secret,
      signature,
      timestamp,
    })
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid signature' },
      { status: 401 }
    );
  }

  // ── 3. Validate payload ──────────────────────────────────────────────────
  const parsed = WhatsAppGuestRegistrationSchema.safeParse(bodyUnknown);
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

  const body = parsed.data;
  const { organizationId, unitId } = body;

  const qrSecret = process.env.QR_SIGNING_SECRET ?? '';
  if (!qrSecret || qrSecret.length < 32) {
    return NextResponse.json(
      { success: false, message: 'Server configuration error' },
      { status: 500 }
    );
  }

  let replay;
  try {
    replay = await runReplayProtectedWebhook(
      { eventId, organizationId, provider: 'whatsapp' },
      async (tx) => {
        // ── 4. Resolve resident + enforce tenant scoping ────────────────────
        const unit = await tx.unit.findFirst({
          where: { id: unitId, organizationId, deletedAt: null },
          select: { userId: true },
        });
        if (!unit?.userId) {
          throw new WebhookRequestError(
            403,
            'Unit not found or has no resident'
          );
        }

        // ── 5. Quota check (read-only; writes remain in this transaction) ───
        const quota = await checkAndConsumeQuota(unitId);
        if (!quota.allowed) {
          throw new WebhookRequestError(
            403,
            'Monthly visitor quota reached',
            quota
          );
        }

        // ── 6. Create pending VisitorQR + underlying QRCode ─────────────────
        const qrId = randomUUID();
        const nonce = randomUUID();
        const expiresAt = body.endDate ? new Date(body.endDate) : null;
        const maxUses = body.type === 'ONETIME' ? 1 : null;
        const prismaType: PrismaQRCodeType =
          body.type === 'ONETIME'
            ? PrismaQRCodeType.VISITOR
            : body.type === 'PERMANENT'
              ? PrismaQRCodeType.OPEN
              : PrismaQRCodeType.RECURRING;
        const signedTypesType: QRCodeType =
          body.type === 'ONETIME'
            ? QRCodeType.VISITOR
            : body.type === 'PERMANENT'
              ? QRCodeType.OPEN
              : QRCodeType.RECURRING;

        const accessRule = await tx.accessRule.create({
          data: {
            type: body.type as AccessRuleType,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: expiresAt,
            recurringDays: body.recurringDays ?? [],
            startTime: body.startTime ?? null,
            endTime: body.endTime ?? null,
          },
        });
        const qrCode = await tx.qRCode.create({
          data: {
            id: qrId,
            code: signQRPayload(
              {
                qrId,
                organizationId,
                type: signedTypesType,
                maxUses,
                expiresAt: expiresAt?.toISOString() ?? null,
                issuedAt: new Date().toISOString(),
                nonce,
              },
              qrSecret
            ),
            type: prismaType,
            organizationId,
            gateId: body.gateId ?? null,
            maxUses,
            expiresAt,
            isActive: false,
            utmSource: null,
            utmMedium: null,
            utmCampaign: null,
            utmContent: null,
            utmTerm: null,
            guestName: body.visitorName ?? null,
            guestPhone: body.visitorPhone ?? null,
            guestEmail: body.visitorEmail ?? null,
          },
        });

        return tx.visitorQR.create({
          data: {
            qrCodeId: qrCode.id,
            unitId,
            visitorName: body.visitorName ?? null,
            visitorPhone: body.visitorPhone ?? null,
            visitorEmail: body.visitorEmail ?? null,
            isOpenQR: false,
            accessRuleId: accessRule.id,
            createdBy: unit.userId,
          },
        });
      }
    );
  } catch (error: unknown) {
    if (error instanceof WebhookRequestError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          ...(error.details ? { quotaStatus: error.details } : {}),
        },
        { status: error.status }
      );
    }
    throw error;
  }

  if (replay.duplicate === true) {
    return NextResponse.json({ success: true, duplicate: true });
  }
  const visitorQR = replay.value;

  // ── 7. Notify dashboard timeline (optional but useful) ────────────────
  void emitEvent(organizationId, EventType.QR_CREATED, {
    qrId: visitorQR.qrCodeId,
  });

  // ── 8. Trigger resident approval push best-effort ───────────────────────
  const expoToken = await getResidentExpoToken({
    organizationId,
    unitId,
  });

  if (expoToken) {
    const gateName = await getGateName({
      organizationId,
      gateId: body.gateId,
    });

    void sendApprovalPushBestEffort({
      expoPushToken: expoToken,
      gateName,
      visitorQRId: visitorQR.id,
      visitorName: body.visitorName,
    });
  }

  // ── 9. Respond to WhatsApp webhook ───────────────────────────────────────
  return NextResponse.json({
    success: true,
    data: {
      visitorQRId: visitorQR.id,
      qrCodeId: visitorQR.qrCodeId,
      status: 'PENDING_APPROVAL',
    },
  });
}

class WebhookRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
  }
}
