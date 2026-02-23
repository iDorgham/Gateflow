import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { encryptField, decryptField } from '@/lib/encryption';
import { revalidatePath } from 'next/cache';


const ALL_EVENTS = [
  'QR_CREATED',
  'QR_SCANNED',
  'QR_REVOKED',
  'QR_EXPIRED',
  'SCAN_SUCCESS',
  'SCAN_FAILED',
] as const;

const CreateWebhookSchema = z.object({
  url: z.string().url('Must be a valid HTTPS URL'),
  events: z.array(z.enum(ALL_EVENTS)).min(1, 'Subscribe to at least one event'),
});

// ─── GET /api/webhooks ────────────────────────────────────────────────────────
// Returns all webhooks for the org with last 5 deliveries (secret omitted).

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const webhooks = await prisma.webhook.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        events: true,
        isActive: true,
        createdAt: true,
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            event: true,
            status: true,
            statusCode: true,
            attemptCount: true,
            lastAttemptAt: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: webhooks });
  } catch (err) {
    console.error('GET /api/webhooks error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/webhooks ───────────────────────────────────────────────────────
// Creates a webhook. Returns the secret once — store it immediately.

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const validation = CreateWebhookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Org may have at most 20 webhooks (sane limit)
    const count = await prisma.webhook.count({
      where: { organizationId: claims.orgId, deletedAt: null },
    });
    if (count >= 20) {
      return NextResponse.json(
        {
          success: false,
          message: 'Maximum of 20 webhooks per organisation reached.',
        },
        { status: 422 }
      );
    }

    const secret = randomBytes(32).toString('hex');
    const encryptedSecret = encryptField(secret);

    const webhook = await prisma.webhook.create({
      data: {
        url: validation.data.url,
        events: validation.data.events,
        secret: encryptedSecret,
        organizationId: claims.orgId,
        isActive: true,
      },
      select: {
        id: true,
        url: true,
        events: true,
        isActive: true,
        createdAt: true,
      },
    });

    revalidatePath('/dashboard/settings');
    // Return the secret in the creation response only (never again)
    return NextResponse.json(
      { success: true, data: { ...webhook, secret } },
      { status: 201 }
    );

  } catch (err) {
    console.error('POST /api/webhooks error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
